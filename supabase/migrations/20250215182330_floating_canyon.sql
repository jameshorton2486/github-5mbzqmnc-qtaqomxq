/*
  # Site Structure and Analytics Tracking

  1. New Tables
    - site_analytics
      - Tracks page views, performance metrics, and user behavior
    - site_structure
      - Stores site hierarchy and navigation relationships
    - page_metrics
      - Stores performance and SEO metrics for each page
    - user_journeys
      - Tracks user navigation paths and conversion funnels

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Secure analytics data

  3. Functions
    - Track page views and metrics
    - Analyze user journeys
    - Generate site structure reports
*/

-- Create site_analytics table
CREATE TABLE IF NOT EXISTS site_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  session_id uuid REFERENCES user_sessions(id),
  timestamp timestamptz DEFAULT now(),
  metrics jsonb DEFAULT '{}'::jsonb,
  user_agent text,
  referrer text,
  device_type text,
  country_code text,
  performance_data jsonb DEFAULT '{}'::jsonb
);

-- Create site_structure table
CREATE TABLE IF NOT EXISTS site_structure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text UNIQUE NOT NULL,
  parent_path text REFERENCES site_structure(path),
  title text NOT NULL,
  description text,
  last_modified timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  seo_data jsonb DEFAULT '{}'::jsonb
);

-- Create page_metrics table
CREATE TABLE IF NOT EXISTS page_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text REFERENCES site_structure(path),
  timestamp timestamptz DEFAULT now(),
  load_time integer,
  fcp_time integer, -- First Contentful Paint
  lcp_time integer, -- Largest Contentful Paint
  cls_score float,  -- Cumulative Layout Shift
  accessibility_score integer,
  seo_score integer,
  performance_score integer
);

-- Create user_journeys table
CREATE TABLE IF NOT EXISTS user_journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  session_id uuid REFERENCES user_sessions(id),
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  path_sequence text[],
  conversion_points jsonb DEFAULT '[]'::jsonb,
  journey_metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_analytics_page_path ON site_analytics(page_path);
CREATE INDEX idx_analytics_timestamp ON site_analytics(timestamp);
CREATE INDEX idx_analytics_user ON site_analytics(user_id);
CREATE INDEX idx_structure_path ON site_structure(path);
CREATE INDEX idx_metrics_page_path ON page_metrics(page_path);
CREATE INDEX idx_journeys_user ON user_journeys(user_id);
CREATE INDEX idx_journeys_session ON user_journeys(session_id);

-- Create RLS policies
CREATE POLICY "Public site structure viewable by everyone"
  ON site_structure
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Analytics viewable by admins"
  ON site_analytics
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');

CREATE POLICY "Metrics viewable by admins"
  ON page_metrics
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');

CREATE POLICY "User journeys viewable by admins"
  ON user_journeys
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');

-- Create function to track page view
CREATE OR REPLACE FUNCTION track_page_view(
  p_page_path text,
  p_user_id uuid,
  p_session_id uuid,
  p_metrics jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_analytics_id uuid;
BEGIN
  INSERT INTO site_analytics (
    page_path,
    user_id,
    session_id,
    metrics
  ) VALUES (
    p_page_path,
    p_user_id,
    p_session_id,
    p_metrics
  )
  RETURNING id INTO v_analytics_id;

  -- Update user journey
  INSERT INTO user_journeys (
    user_id,
    session_id,
    path_sequence
  )
  VALUES (
    p_user_id,
    p_session_id,
    ARRAY[p_page_path]
  )
  ON CONFLICT (session_id)
  DO UPDATE SET
    path_sequence = array_append(user_journeys.path_sequence, p_page_path),
    journey_metadata = jsonb_set(
      user_journeys.journey_metadata,
      '{last_update}',
      to_jsonb(now())
    );

  RETURN v_analytics_id;
END;
$$;

-- Create function to analyze user journey
CREATE OR REPLACE FUNCTION analyze_user_journey(
  p_user_id uuid,
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  total_sessions bigint,
  avg_session_duration interval,
  most_visited_pages text[],
  conversion_rate float,
  common_paths jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH journey_stats AS (
    SELECT
      count(DISTINCT session_id) as session_count,
      avg(end_time - start_time) as avg_duration,
      array_agg(DISTINCT unnest(path_sequence)) as visited_pages,
      count(DISTINCT CASE WHEN jsonb_array_length(conversion_points) > 0 THEN session_id END)::float / 
        count(DISTINCT session_id)::float as conv_rate,
      jsonb_agg(DISTINCT path_sequence) as paths
    FROM user_journeys
    WHERE user_id = p_user_id
    AND start_time >= now() - (p_days || ' days')::interval
  )
  SELECT
    session_count,
    avg_duration,
    visited_pages,
    conv_rate,
    paths
  FROM journey_stats;
END;
$$;

-- Create function to generate site structure report
CREATE OR REPLACE FUNCTION generate_site_report()
RETURNS TABLE (
  path text,
  title text,
  avg_load_time float,
  total_views bigint,
  bounce_rate float,
  conversion_rate float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.path,
    s.title,
    avg(m.load_time)::float as avg_load_time,
    count(DISTINCT a.id) as total_views,
    count(DISTINCT CASE WHEN array_length(j.path_sequence, 1) = 1 THEN j.id END)::float /
      NULLIF(count(DISTINCT j.id), 0)::float as bounce_rate,
    count(DISTINCT CASE WHEN jsonb_array_length(j.conversion_points) > 0 THEN j.id END)::float /
      NULLIF(count(DISTINCT j.id), 0)::float as conversion_rate
  FROM site_structure s
  LEFT JOIN page_metrics m ON m.page_path = s.path
  LEFT JOIN site_analytics a ON a.page_path = s.path
  LEFT JOIN user_journeys j ON j.path_sequence @> ARRAY[s.path]
  WHERE s.is_active = true
  GROUP BY s.path, s.title
  ORDER BY total_views DESC;
END;
$$;