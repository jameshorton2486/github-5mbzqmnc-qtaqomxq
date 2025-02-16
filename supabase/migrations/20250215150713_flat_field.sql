/*
  # Session Tracking Improvements
  
  1. New Tables
    - user_sessions: Track active user sessions
    - session_activities: Log user actions
    - session_devices: Store device information
  
  2. Changes
    - Add session tracking fields to existing tables
    - Add activity logging capabilities
    - Add device fingerprinting
  
  3. Security
    - Enable RLS on all new tables
    - Add policies for secure access
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token text UNIQUE NOT NULL,
  device_id uuid,
  ip_address text,
  user_agent text,
  last_active timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create session_activities table
CREATE TABLE IF NOT EXISTS session_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES user_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  resource_type text,
  resource_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create session_devices table
CREATE TABLE IF NOT EXISTS session_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_name text,
  device_type text,
  browser text,
  os text,
  last_used timestamptz DEFAULT now(),
  is_trusted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_devices ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_session_activities_session ON session_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_session_activities_user ON session_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_session_activities_type ON session_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_session_devices_user ON session_devices(user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON user_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for session_activities
CREATE POLICY "Users can view own activities"
  ON session_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON session_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for session_devices
CREATE POLICY "Users can view own devices"
  ON session_devices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own devices"
  ON session_devices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired sessions
  DELETE FROM user_sessions
  WHERE expires_at < now();
  
  -- Delete orphaned activities
  DELETE FROM session_activities
  WHERE session_id NOT IN (
    SELECT id FROM user_sessions
  );
  
  -- Update device last_used
  UPDATE session_devices
  SET last_used = (
    SELECT max(last_active)
    FROM user_sessions
    WHERE user_sessions.device_id = session_devices.id
  )
  WHERE id IN (
    SELECT DISTINCT device_id
    FROM user_sessions
  );
END;
$$;

-- Create function to log activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_session_id uuid,
  p_activity_type text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_activity_id uuid;
BEGIN
  -- Get user_id from session
  SELECT user_id INTO v_user_id
  FROM user_sessions
  WHERE id = p_session_id;

  -- Insert activity
  INSERT INTO session_activities (
    session_id,
    user_id,
    activity_type,
    resource_type,
    resource_id,
    metadata
  ) VALUES (
    p_session_id,
    v_user_id,
    p_activity_type,
    p_resource_type,
    p_resource_id,
    p_metadata
  )
  RETURNING id INTO v_activity_id;

  -- Update session last_active
  UPDATE user_sessions
  SET last_active = now()
  WHERE id = p_session_id;

  RETURN v_activity_id;
END;
$$;