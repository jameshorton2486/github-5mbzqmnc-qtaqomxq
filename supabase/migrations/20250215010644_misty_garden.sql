/*
  # Add Deposition Fields and Policies
  
  1. Changes
    - Add new columns for interpreter and exhibit information
    - Add attorney contact information
    - Add constraints for data validation
    - Update RLS policies
  
  2. Security
    - Maintain existing RLS policies
    - Add data validation constraints
*/

-- First ensure the depositions table exists
CREATE TABLE IF NOT EXISTS depositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE depositions ENABLE ROW LEVEL SECURITY;

-- Add new columns
ALTER TABLE depositions
ADD COLUMN IF NOT EXISTS interpreter_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS interpreter_language text,
ADD COLUMN IF NOT EXISTS exhibits_expected boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS exhibit_delivery_method text,
ADD COLUMN IF NOT EXISTS court_order_file_path text,
ADD COLUMN IF NOT EXISTS attorney_name text,
ADD COLUMN IF NOT EXISTS attorney_email text,
ADD COLUMN IF NOT EXISTS attorney_phone text,
ADD COLUMN IF NOT EXISTS law_firm text;

-- Add constraints for new fields
DO $$ 
BEGIN
  ALTER TABLE depositions
    ADD CONSTRAINT valid_interpreter_info 
    CHECK (
      (interpreter_required = true AND interpreter_language IS NOT NULL) OR
      (interpreter_required = false)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  ALTER TABLE depositions
    ADD CONSTRAINT valid_exhibit_info 
    CHECK (
      (exhibits_expected = true AND exhibit_delivery_method IS NOT NULL) OR
      (exhibits_expected = false)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own depositions" ON depositions;
  DROP POLICY IF EXISTS "Users can create own depositions" ON depositions;
  DROP POLICY IF EXISTS "Users can update own depositions" ON depositions;
  DROP POLICY IF EXISTS "Users can delete own depositions" ON depositions;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Create new policies
DO $$ 
BEGIN
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
END $$;