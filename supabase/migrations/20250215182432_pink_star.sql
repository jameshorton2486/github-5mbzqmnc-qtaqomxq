/*
  # Site Structure and Analytics Enhancements

  1. New Tables
    - site_preferences
      - Stores user-specific site preferences and settings
    - site_feedback
      - Tracks user feedback and suggestions
    - site_experiments
      - Manages A/B testing configurations
    - site_notifications
      - Handles user notifications about site changes

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Secure user preferences

  3. Functions
    - Manage user preferences
    - Track experiment participation
    - Handle site notifications
*/

-- Create site_preferences table
CREATE TABLE IF NOT EXISTS site_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'system',
  language text DEFAULT 'en',
  notifications_enabled boolean DEFAULT true,
  accessibility_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- Create site_feedback table
CREATE TABLE IF NOT EXISTS site_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  page_path text NOT NULL,
  feedback_type text NOT NULL,
  content text NOT NULL,
  rating integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Create site_experiments table
CREATE TABLE IF NOT EXISTS site_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  variants jsonb NOT NULL,
  target_audience jsonb DEFAULT '{}'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_experiment_dates CHECK (end_date > start_date)
);

-- Create site_notifications table
CREATE TABLE IF NOT EXISTS site_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  is_read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_preferences_user ON site_preferences(user_id);
CREATE INDEX idx_feedback_user ON site_feedback(user_id);
CREATE INDEX idx_feedback_page ON site_feedback(page_path);
CREATE INDEX idx_experiments_active ON site_experiments(is_active) WHERE is_active = true;
CREATE INDEX idx_notifications_user ON site_notifications(user_id);
CREATE INDEX idx_notifications_unread ON site_notifications(user_id) WHERE is_read = false;

-- Create RLS policies
CREATE POLICY "Users can manage their own preferences"
  ON site_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can submit feedback"
  ON site_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON site_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage experiments"
  ON site_experiments
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Users can view active experiments"
  ON site_experiments
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage their notifications"
  ON site_notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update user preferences
CREATE OR REPLACE FUNCTION update_user_preferences(
  p_user_id uuid,
  p_preferences jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO site_preferences (
    user_id,
    theme,
    language,
    notifications_enabled,
    accessibility_settings
  )
  VALUES (
    p_user_id,
    COALESCE(p_preferences->>'theme', 'system'),
    COALESCE(p_preferences->>'language', 'en'),
    COALESCE((p_preferences->>'notifications_enabled')::boolean, true),
    COALESCE(p_preferences->'accessibility_settings', '{}'::jsonb)
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    theme = EXCLUDED.theme,
    language = EXCLUDED.language,
    notifications_enabled = EXCLUDED.notifications_enabled,
    accessibility_settings = EXCLUDED.accessibility_settings,
    updated_at = now();
END;
$$;

-- Create function to track experiment participation
CREATE OR REPLACE FUNCTION assign_experiment_variant(
  p_user_id uuid,
  p_experiment_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_experiment site_experiments%ROWTYPE;
  v_variant jsonb;
BEGIN
  -- Get active experiment
  SELECT *
  INTO v_experiment
  FROM site_experiments
  WHERE id = p_experiment_id
    AND is_active = true
    AND (end_date IS NULL OR end_date > now());
    
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Deterministically assign variant based on user_id
  SELECT value INTO v_variant
  FROM jsonb_array_elements(v_experiment.variants) value
  OFFSET mod(
    ('x' || substr(p_user_id::text, 1, 8))::bit(32)::int,
    jsonb_array_length(v_experiment.variants)
  )
  LIMIT 1;
  
  RETURN v_variant;
END;
$$;

-- Create function to manage notifications
CREATE OR REPLACE FUNCTION create_site_notification(
  p_user_id uuid,
  p_title text,
  p_content text,
  p_type text,
  p_metadata jsonb DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO site_notifications (
    user_id,
    title,
    content,
    type,
    metadata,
    expires_at
  )
  VALUES (
    p_user_id,
    p_title,
    p_content,
    p_type,
    COALESCE(p_metadata, '{}'::jsonb),
    p_expires_at
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;