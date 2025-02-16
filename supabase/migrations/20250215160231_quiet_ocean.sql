-- Add metadata and tracking improvements to user_sessions
ALTER TABLE user_sessions
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS device_fingerprint text,
ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_ip_address text;

-- Create function for enhanced session tracking
CREATE OR REPLACE FUNCTION track_session_activity(
  p_session_id uuid,
  p_activity_type text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_device_id uuid;
BEGIN
  -- Get session info
  SELECT user_id, device_id INTO v_user_id, v_device_id
  FROM user_sessions
  WHERE id = p_session_id;

  -- Log activity with enhanced metadata
  INSERT INTO session_activities (
    session_id,
    user_id,
    activity_type,
    metadata,
    created_at
  ) VALUES (
    p_session_id,
    v_user_id,
    p_activity_type,
    jsonb_build_object(
      'device_id', v_device_id,
      'timestamp', extract(epoch from now()),
      'custom_data', p_metadata
    ),
    now()
  );

  -- Update session metadata
  UPDATE user_sessions
  SET 
    last_active = now(),
    metadata = jsonb_set(
      metadata,
      '{last_activity}',
      to_jsonb(p_activity_type)
    )
  WHERE id = p_session_id;
END;
$$;

-- Create function for session analytics
CREATE OR REPLACE FUNCTION get_session_analytics(
  p_user_id uuid,
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  total_sessions bigint,
  active_sessions bigint,
  total_activities bigint,
  unique_devices bigint,
  last_active timestamptz,
  most_used_device jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH session_stats AS (
    SELECT
      count(DISTINCT s.id) as session_count,
      count(DISTINCT s.id) FILTER (WHERE s.expires_at > now()) as active_count,
      count(DISTINCT s.device_id) as device_count,
      count(a.id) as activity_count,
      max(s.last_active) as last_active_at,
      mode() WITHIN GROUP (ORDER BY s.device_id) as common_device_id
    FROM user_sessions s
    LEFT JOIN session_activities a ON a.session_id = s.id
    WHERE s.user_id = p_user_id
    AND s.created_at >= now() - (p_days || ' days')::interval
  ),
  device_info AS (
    SELECT jsonb_build_object(
      'id', d.id,
      'name', d.device_name,
      'type', d.device_type,
      'last_used', d.last_used
    ) as device_data
    FROM session_stats
    JOIN session_devices d ON d.id = session_stats.common_device_id
  )
  SELECT
    session_count,
    active_count,
    activity_count,
    device_count,
    last_active_at,
    device_data
  FROM session_stats, device_info;
END;
$$;

-- Create materialized view for session activity aggregation
CREATE MATERIALIZED VIEW IF NOT EXISTS session_activity_summary
AS
SELECT
  user_id,
  date_trunc('day', created_at) as activity_date,
  count(*) as activity_count,
  count(DISTINCT session_id) as session_count,
  array_agg(DISTINCT activity_type) as activity_types
FROM session_activities
GROUP BY user_id, date_trunc('day', created_at)
WITH NO DATA;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_activity_summary
ON session_activity_summary (user_id, activity_date);

-- Create function to refresh activity summary
CREATE OR REPLACE FUNCTION refresh_session_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY session_activity_summary;
END;
$$;

-- Add improved session cleanup
CREATE OR REPLACE FUNCTION cleanup_session_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove expired sessions
  DELETE FROM user_sessions
  WHERE expires_at < now();

  -- Remove orphaned activities
  DELETE FROM session_activities
  WHERE session_id NOT IN (
    SELECT id FROM user_sessions
  );

  -- Update device last_used
  UPDATE session_devices d
  SET last_used = (
    SELECT max(last_active)
    FROM user_sessions s
    WHERE s.device_id = d.id
  )
  WHERE EXISTS (
    SELECT 1
    FROM user_sessions s
    WHERE s.device_id = d.id
  );

  -- Remove unused devices
  DELETE FROM session_devices
  WHERE last_used < now() - interval '90 days'
  AND NOT EXISTS (
    SELECT 1
    FROM user_sessions s
    WHERE s.device_id = session_devices.id
    AND s.expires_at > now()
  );
END;
$$;

-- Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_sessions_metadata ON user_sessions USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_sessions_device_fingerprint ON user_sessions (device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_activities_metadata ON session_activities USING gin (metadata);

-- Update session validation
CREATE OR REPLACE FUNCTION validate_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Enhanced validation checks
  IF NEW.session_token IS NULL OR length(NEW.session_token) < 32 THEN
    RAISE EXCEPTION 'Invalid session token';
  END IF;

  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Session expiration must be in the future';
  END IF;

  IF NEW.device_fingerprint IS NULL AND NEW.device_id IS NOT NULL THEN
    NEW.device_fingerprint := encode(digest(NEW.device_id::text || NEW.user_agent, 'sha256'), 'hex');
  END IF;

  -- Update last_ip_address if changed
  IF TG_OP = 'UPDATE' AND NEW.ip_address != OLD.ip_address THEN
    NEW.last_ip_address := OLD.ip_address;
  END IF;

  -- Increment login count on new session
  IF TG_OP = 'INSERT' THEN
    NEW.login_count := 1;
  ELSIF TG_OP = 'UPDATE' AND NEW.session_token != OLD.session_token THEN
    NEW.login_count := OLD.login_count + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;