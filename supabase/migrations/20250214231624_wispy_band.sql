/*
  # Deposition Scheduling System Improvements

  1. New Features
    - Add notification preferences
    - Add recurring deposition support
    - Add participant roles and contact info
    - Add billing information
    - Add custom fields support

  2. Security
    - Maintain existing RLS policies
    - Add field-level security
*/

-- Add notification preferences
ALTER TABLE depositions
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT jsonb_build_object(
  'email', true,
  'sms', false,
  'reminder_hours', 24
);

-- Add recurring deposition support
ALTER TABLE depositions
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS recurrence_pattern jsonb,
ADD COLUMN IF NOT EXISTS series_id uuid,
ADD COLUMN IF NOT EXISTS original_deposition_id uuid REFERENCES depositions(id);

-- Add participant roles and contact info
CREATE TABLE IF NOT EXISTS deposition_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deposition_id uuid REFERENCES depositions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  role text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_role CHECK (
    role IN ('attorney', 'witness', 'court_reporter', 'videographer', 'interpreter', 'observer')
  )
);

-- Add billing information
ALTER TABLE depositions
ADD COLUMN IF NOT EXISTS billing_info jsonb DEFAULT jsonb_build_object(
  'billing_type', 'standard',
  'payment_method', 'invoice',
  'purchase_order', null,
  'billing_notes', null
);

-- Add custom fields support
ALTER TABLE depositions
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}';

-- Enable RLS on new table
ALTER TABLE deposition_participants ENABLE ROW LEVEL SECURITY;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_depositions_recurring ON depositions(is_recurring) WHERE is_recurring = true;
CREATE INDEX IF NOT EXISTS idx_depositions_series ON depositions(series_id) WHERE series_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deposition_participants_deposition ON deposition_participants(deposition_id);
CREATE INDEX IF NOT EXISTS idx_deposition_participants_user ON deposition_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_deposition_participants_role ON deposition_participants(role);

-- Create RLS policies for deposition_participants
CREATE POLICY "Users can view participants of their depositions"
  ON deposition_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM depositions d
      WHERE d.id = deposition_id
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add participants to their depositions"
  ON deposition_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM depositions d
      WHERE d.id = deposition_id
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update participants of their depositions"
  ON deposition_participants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM depositions d
      WHERE d.id = deposition_id
      AND d.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM depositions d
      WHERE d.id = deposition_id
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete participants from their depositions"
  ON deposition_participants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM depositions d
      WHERE d.id = deposition_id
      AND d.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at on deposition_participants
CREATE TRIGGER set_deposition_participants_updated_at
  BEFORE UPDATE ON deposition_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add function to clone deposition for recurring series
CREATE OR REPLACE FUNCTION clone_deposition(
  deposition_id uuid,
  new_date timestamptz
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_deposition_id uuid;
BEGIN
  INSERT INTO depositions (
    user_id,
    case_name,
    case_number,
    jurisdiction,
    scheduled_date,
    duration_hours,
    location,
    location_type,
    platform,
    meeting_link,
    witness_name,
    witness_title,
    witness_email,
    witness_phone,
    court_reporter,
    videographer,
    interpreter_required,
    interpreter_language,
    exhibits_expected,
    exhibit_delivery_method,
    court_order_file_path,
    attorney_name,
    attorney_email,
    attorney_phone,
    law_firm,
    notes,
    is_recurring,
    series_id,
    original_deposition_id,
    notification_preferences,
    billing_info,
    custom_fields
  )
  SELECT
    user_id,
    case_name,
    case_number,
    jurisdiction,
    new_date,
    duration_hours,
    location,
    location_type,
    platform,
    meeting_link,
    witness_name,
    witness_title,
    witness_email,
    witness_phone,
    court_reporter,
    videographer,
    interpreter_required,
    interpreter_language,
    exhibits_expected,
    exhibit_delivery_method,
    court_order_file_path,
    attorney_name,
    attorney_email,
    attorney_phone,
    law_firm,
    notes,
    true,
    COALESCE(series_id, id),
    id,
    notification_preferences,
    billing_info,
    custom_fields
  FROM depositions
  WHERE id = deposition_id
  RETURNING id INTO new_deposition_id;

  -- Clone participants
  INSERT INTO deposition_participants (
    deposition_id,
    user_id,
    role,
    name,
    email,
    phone,
    organization,
    notes
  )
  SELECT
    new_deposition_id,
    user_id,
    role,
    name,
    email,
    phone,
    organization,
    notes
  FROM deposition_participants
  WHERE deposition_id = deposition_id;

  RETURN new_deposition_id;
END;
$$;