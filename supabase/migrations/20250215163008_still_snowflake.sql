/*
  # Navigation and Sitemap Structure

  1. New Tables
    - `navigation_items` - Stores navigation menu items and structure
    - `pages` - Stores page metadata and content
    - `breadcrumbs` - Stores breadcrumb trails
    - `page_redirects` - Stores URL redirects and aliases

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public access where needed

  3. Features
    - Hierarchical navigation structure
    - Page metadata and SEO fields
    - Breadcrumb trail generation
    - URL redirect management
*/

-- Create enum for navigation item types
CREATE TYPE nav_item_type AS ENUM ('link', 'dropdown', 'section');

-- Create enum for page status
CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');

-- Create navigation_items table
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  path text,
  type nav_item_type NOT NULL DEFAULT 'link',
  parent_id uuid REFERENCES navigation_items(id),
  position integer NOT NULL DEFAULT 0,
  icon text,
  requires_auth boolean DEFAULT false,
  allowed_roles text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT valid_path CHECK (
    (type = 'link' AND path IS NOT NULL) OR
    (type != 'link' AND path IS NULL)
  )
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  content jsonb,
  status page_status DEFAULT 'draft',
  is_system_page boolean DEFAULT false,
  requires_auth boolean DEFAULT false,
  allowed_roles text[],
  meta_title text,
  meta_description text,
  meta_keywords text[],
  og_image text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create breadcrumbs table
CREATE TABLE IF NOT EXISTS breadcrumbs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  path text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT unique_page_breadcrumb UNIQUE (page_id)
);

-- Create page_redirects table
CREATE TABLE IF NOT EXISTS page_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text UNIQUE NOT NULL,
  to_path text NOT NULL,
  status_code integer DEFAULT 301,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT valid_status_code CHECK (status_code IN (301, 302, 307, 308))
);

-- Enable Row Level Security
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE breadcrumbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_redirects ENABLE ROW LEVEL SECURITY;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER set_timestamp_navigation_items
  BEFORE UPDATE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_pages
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_breadcrumbs
  BEFORE UPDATE ON breadcrumbs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_page_redirects
  BEFORE UPDATE ON page_redirects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX idx_navigation_items_position ON navigation_items(position);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_page_redirects_from ON page_redirects(from_path);

-- Create RLS Policies

-- Navigation Items Policies
CREATE POLICY "Public navigation items are viewable by everyone"
  ON navigation_items
  FOR SELECT
  USING (
    requires_auth = false OR
    (requires_auth = true AND auth.role() = ANY(allowed_roles))
  );

CREATE POLICY "Only authenticated users can manage navigation"
  ON navigation_items
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Pages Policies
CREATE POLICY "Public pages are viewable by everyone"
  ON pages
  FOR SELECT
  USING (
    status = 'published' AND
    (
      requires_auth = false OR
      (requires_auth = true AND auth.role() = ANY(allowed_roles))
    )
  );

CREATE POLICY "Only authenticated users can manage pages"
  ON pages
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Breadcrumbs Policies
CREATE POLICY "Breadcrumbs are viewable by everyone"
  ON breadcrumbs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can manage breadcrumbs"
  ON breadcrumbs
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Page Redirects Policies
CREATE POLICY "Redirects are viewable by everyone"
  ON page_redirects
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can manage redirects"
  ON page_redirects
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Helper Functions

-- Function to get navigation tree
CREATE OR REPLACE FUNCTION get_navigation_tree(p_parent_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  title text,
  path text,
  type nav_item_type,
  parent_id uuid,
  position integer,
  icon text,
  requires_auth boolean,
  allowed_roles text[],
  metadata jsonb,
  children jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE nav_tree AS (
    -- Base case: get root items
    SELECT
      n.id,
      n.title,
      n.path,
      n.type,
      n.parent_id,
      n.position,
      n.icon,
      n.requires_auth,
      n.allowed_roles,
      n.metadata,
      jsonb_build_array() as children
    FROM navigation_items n
    WHERE n.parent_id IS NULL
    AND (p_parent_id IS NULL OR n.id = p_parent_id)

    UNION ALL

    -- Recursive case: get child items
    SELECT
      n.id,
      n.title,
      n.path,
      n.type,
      n.parent_id,
      n.position,
      n.icon,
      n.requires_auth,
      n.allowed_roles,
      n.metadata,
      jsonb_build_array() as children
    FROM navigation_items n
    INNER JOIN nav_tree nt ON n.parent_id = nt.id
  )
  SELECT * FROM nav_tree
  ORDER BY parent_id NULLS FIRST, position;
END;
$$;

-- Function to generate breadcrumb trail
CREATE OR REPLACE FUNCTION generate_breadcrumb_trail(p_page_id uuid)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_trail text[];
  v_page pages%ROWTYPE;
BEGIN
  -- Get the page
  SELECT * INTO v_page
  FROM pages
  WHERE id = p_page_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Start with the current page
  v_trail := ARRAY[v_page.title];

  -- Get parent pages from navigation structure
  WITH RECURSIVE nav_path AS (
    -- Base case: find navigation item for current page
    SELECT
      ni.id,
      ni.parent_id,
      ni.title,
      ARRAY[ni.title] as path
    FROM navigation_items ni
    WHERE ni.path = '/' || v_page.slug

    UNION ALL

    -- Recursive case: get parent navigation items
    SELECT
      ni.id,
      ni.parent_id,
      ni.title,
      array_prepend(ni.title, np.path)
    FROM navigation_items ni
    INNER JOIN nav_path np ON ni.id = np.parent_id
  )
  SELECT path INTO v_trail
  FROM nav_path
  WHERE parent_id IS NULL
  LIMIT 1;

  RETURN v_trail;
END;
$$;

-- Function to update breadcrumb trail
CREATE OR REPLACE FUNCTION update_breadcrumb_trail()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate and store breadcrumb trail
  INSERT INTO breadcrumbs (page_id, path)
  VALUES (NEW.id, generate_breadcrumb_trail(NEW.id))
  ON CONFLICT (page_id)
  DO UPDATE SET
    path = EXCLUDED.path,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for breadcrumb updates
CREATE TRIGGER update_breadcrumb_trail
  AFTER INSERT OR UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_breadcrumb_trail();