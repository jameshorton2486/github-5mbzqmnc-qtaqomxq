-- Create function for upserting sessions with conflict handling
CREATE OR REPLACE FUNCTION upsert_user_session(
  p_user_id uuid,
  p_session_token text,
  p_device_id uuid,
  p_ip_address text,
  p_user_agent text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id uuid;
BEGIN
  INSERT INTO user_sessions (
    user_id,
    session_token,
    device_id,
    ip_address,
    user_agent,
    expires_at
  ) VALUES (
    p_user_id,
    p_session_token,
    p_device_id,
    p_ip_address,
    p_user_agent,
    now() + interval '24 hours'
  )
  ON CONFLICT (session_token) DO UPDATE SET
    last_active = now(),
    ip_address = p_ip_address,
    user_agent = p_user_agent
  RETURNING id INTO v_session_id;
  
  RETURN v_session_id;
END;
$$;

-- Create function for enhanced activity logging
CREATE OR REPLACE FUNCTION log_session_activity(
  p_session_id uuid,
  p_user_id uuid,
  p_activity_type text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO session_activities (
    session_id,
    user_id,
    activity_type,
    metadata,
    created_at
  ) VALUES (
    p_session_id,
    p_user_id,
    p_activity_type,
    p_metadata,
    now()
  )
  RETURNING id INTO v_activity_id;

  -- Update session last_active
  UPDATE user_sessions
  SET last_active = now()
  WHERE id = p_session_id;

  RETURN v_activity_id;
END;
$$;

-- Create function for improved session cleanup
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions(p_hours int DEFAULT 24)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count int;
BEGIN
  WITH deleted_sessions AS (
    DELETE FROM user_sessions
    WHERE last_active < now() - (p_hours || ' hours')::interval
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM deleted_sessions;

  -- Cleanup related activities
  DELETE FROM session_activities
  WHERE session_id NOT IN (
    SELECT id FROM user_sessions
  );

  RETURN v_count;
END;
$$;

-- Add session validation trigger
CREATE OR REPLACE FUNCTION validate_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure session token is valid
  IF NEW.session_token IS NULL OR length(NEW.session_token) < 32 THEN
    RAISE EXCEPTION 'Invalid session token';
  END IF;

  -- Ensure expiration is in the future
  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Session expiration must be in the future';
  END IF;

  -- Set last_active if not set
  IF NEW.last_active IS NULL THEN
    NEW.last_active := now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create session validation trigger
DO $$ BEGIN
  CREATE TRIGGER validate_session_trigger
    BEFORE INSERT OR UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION validate_session();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add indexes for performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_sessions_last_active 
    ON user_sessions(last_active);
  
  CREATE INDEX IF NOT EXISTS idx_sessions_user_token 
    ON user_sessions(user_id, session_token);
  
  CREATE INDEX IF NOT EXISTS idx_activities_created 
    ON session_activities(created_at DESC);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create function to get active user sessions
CREATE OR REPLACE FUNCTION get_active_user_sessions(p_user_id uuid)
RETURNS TABLE (
  session_id uuid,
  created_at timestamptz,
  last_active timestamptz,
  device_info jsonb,
  activity_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as session_id,
    s.created_at,
    s.last_active,
    jsonb_build_object(
      'device_id', s.device_id,
      'ip_address', s.ip_address,
      'user_agent', s.user_agent
    ) as device_info,
    count(a.id) as activity_count
  FROM user_sessions s
  LEFT JOIN session_activities a ON a.session_id = s.id
  WHERE s.user_id = p_user_id
    AND s.expires_at > now()
  GROUP BY s.id
  ORDER BY s.last_active DESC;
END;
$$;

-- Create periodic cleanup function
CREATE OR REPLACE FUNCTION periodic_session_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM cleanup_inactive_sessions(24);
END;
$$;