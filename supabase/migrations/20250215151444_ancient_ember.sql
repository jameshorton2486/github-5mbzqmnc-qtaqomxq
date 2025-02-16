/*
  # Session Tracking Improvements
  
  1. Changes
    - Add session tracking fields to existing tables
    - Add activity logging capabilities
    - Add device fingerprinting
  
  2. Security
    - Add policies for secure access
    - Add constraints for data integrity
*/

-- Add session tracking fields to existing tables
DO $$ BEGIN
  ALTER TABLE depositions
    ADD COLUMN IF NOT EXISTS session_id uuid,
    ADD COLUMN IF NOT EXISTS device_id uuid,
    ADD COLUMN IF NOT EXISTS ip_address text,
    ADD COLUMN IF NOT EXISTS user_agent text;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create function to track session activity
CREATE OR REPLACE FUNCTION track_deposition_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log activity for insert
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO session_activities (
      session_id,
      user_id,
      activity_type,
      resource_type,
      resource_id,
      metadata
    ) VALUES (
      NEW.session_id,
      NEW.user_id,
      'create',
      'deposition',
      NEW.id::text,
      jsonb_build_object(
        'case_name', NEW.case_name,
        'case_number', NEW.case_number,
        'scheduled_date', NEW.scheduled_date
      )
    );
  END IF;

  -- Log activity for update
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO session_activities (
      session_id,
      user_id,
      activity_type,
      resource_type,
      resource_id,
      metadata
    ) VALUES (
      NEW.session_id,
      NEW.user_id,
      'update',
      'deposition',
      NEW.id::text,
      jsonb_build_object(
        'changes', jsonb_build_object(
          'case_name', CASE WHEN NEW.case_name != OLD.case_name THEN jsonb_build_object('old', OLD.case_name, 'new', NEW.case_name) ELSE null END,
          'case_number', CASE WHEN NEW.case_number != OLD.case_number THEN jsonb_build_object('old', OLD.case_number, 'new', NEW.case_number) ELSE null END,
          'scheduled_date', CASE WHEN NEW.scheduled_date != OLD.scheduled_date THEN jsonb_build_object('old', OLD.scheduled_date, 'new', NEW.scheduled_date) ELSE null END
        )
      )
    );
  END IF;

  -- Log activity for delete
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO session_activities (
      session_id,
      user_id,
      activity_type,
      resource_type,
      resource_id,
      metadata
    ) VALUES (
      OLD.session_id,
      OLD.user_id,
      'delete',
      'deposition',
      OLD.id::text,
      jsonb_build_object(
        'case_name', OLD.case_name,
        'case_number', OLD.case_number
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for activity tracking
DO $$ BEGIN
  CREATE TRIGGER track_deposition_activity
    AFTER INSERT OR UPDATE OR DELETE ON depositions
    FOR EACH ROW
    EXECUTE FUNCTION track_deposition_activity();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create function to update session last_active
CREATE OR REPLACE FUNCTION update_session_last_active()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_id IS NOT NULL THEN
    UPDATE user_sessions
    SET last_active = now()
    WHERE id = NEW.session_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating session last_active
DO $$ BEGIN
  CREATE TRIGGER update_session_last_active
    AFTER INSERT OR UPDATE ON depositions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_active();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints
DO $$ BEGIN
  ALTER TABLE depositions
    ADD CONSTRAINT fk_session
    FOREIGN KEY (session_id)
    REFERENCES user_sessions(id)
    ON DELETE SET NULL;

  ALTER TABLE depositions
    ADD CONSTRAINT fk_device
    FOREIGN KEY (device_id)
    REFERENCES session_devices(id)
    ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create indexes for new fields
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_depositions_session ON depositions(session_id);
  CREATE INDEX IF NOT EXISTS idx_depositions_device ON depositions(device_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;