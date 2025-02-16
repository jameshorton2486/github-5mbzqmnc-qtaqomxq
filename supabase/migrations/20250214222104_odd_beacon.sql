/*
  # Create depositions table with attorney details and court order files

  1. New Tables
    - `depositions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `case_name` (text)
      - `case_number` (text)
      - `jurisdiction` (text)
      - `scheduled_date` (timestamptz)
      - `duration_hours` (integer)
      - `location` (text)
      - `location_type` (enum: remote, in-person, hybrid)
      - `platform` (text, for remote depositions)
      - `meeting_link` (text, for remote depositions)
      - `witness_name` (text)
      - `witness_title` (text)
      - `witness_email` (text)
      - `witness_phone` (text)
      - `court_reporter` (text)
      - `videographer` (text)
      - `interpreter_required` (boolean)
      - `interpreter_language` (text)
      - `exhibits_expected` (boolean)
      - `exhibit_delivery_method` (text)
      - `court_order_file_path` (text)
      - `attorney_name` (text)
      - `attorney_email` (text)
      - `attorney_phone` (text)
      - `law_firm` (text)
      - `notes` (text)
      - `status` (enum: scheduled, completed, cancelled)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on depositions table
    - Add policies for CRUD operations
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE deposition_location_type AS ENUM ('remote', 'in-person', 'hybrid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE deposition_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create depositions table
CREATE TABLE IF NOT EXISTS depositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  case_name text NOT NULL,
  case_number text NOT NULL,
  jurisdiction text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  duration_hours integer NOT NULL,
  location text NOT NULL,
  location_type deposition_location_type NOT NULL,
  platform text,
  meeting_link text,
  witness_name text NOT NULL,
  witness_title text,
  witness_email text NOT NULL,
  witness_phone text,
  court_reporter text NOT NULL,
  videographer text,
  interpreter_required boolean DEFAULT false,
  interpreter_language text,
  exhibits_expected boolean DEFAULT false,
  exhibit_delivery_method text,
  court_order_file_path text,
  attorney_name text NOT NULL,
  attorney_email text NOT NULL,
  attorney_phone text NOT NULL,
  law_firm text NOT NULL,
  notes text,
  status deposition_status DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT valid_remote_deposition CHECK (
    (location_type = 'remote' AND platform IS NOT NULL AND meeting_link IS NOT NULL) OR
    (location_type != 'remote')
  ),
  CONSTRAINT valid_interpreter CHECK (
    (interpreter_required = true AND interpreter_language IS NOT NULL) OR
    (interpreter_required = false)
  ),
  CONSTRAINT valid_exhibit_delivery CHECK (
    (exhibits_expected = true AND exhibit_delivery_method IS NOT NULL) OR
    (exhibits_expected = false)
  )
);

-- Enable Row Level Security
ALTER TABLE depositions ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_depositions_updated_at'
  ) THEN
    CREATE TRIGGER set_depositions_updated_at
      BEFORE UPDATE ON depositions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_depositions_user_id ON depositions(user_id);
CREATE INDEX IF NOT EXISTS idx_depositions_scheduled_date ON depositions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_depositions_status ON depositions(status);
CREATE INDEX IF NOT EXISTS idx_depositions_case_number ON depositions(case_number);

-- Create RLS Policies
CREATE POLICY "Users can view own depositions"
  ON depositions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own depositions"
  ON depositions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own depositions"
  ON depositions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own depositions"
  ON depositions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);