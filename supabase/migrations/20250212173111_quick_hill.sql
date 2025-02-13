/*
  # Update transcriptions table and policies

  1. Changes
    - Make youtube_url nullable
    - Add file_name column
    - Add cleanup function for old transcriptions
    - Update RLS policies with proper checks

  2. Security
    - Maintain RLS on transcriptions table
    - Add policies only if they don't exist
    - Ensure proper cascade deletion with user accounts

  3. Performance
    - Add indexes for common queries
    - Add function for periodic cleanup
*/

-- Create transcriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transcriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  youtube_url text,
  file_name text,
  transcript_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

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
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_transcriptions_updated_at'
  ) THEN
    CREATE TRIGGER set_transcriptions_updated_at
      BEFORE UPDATE ON transcriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create RLS Policies with existence checks
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own transcriptions'
  ) THEN
    CREATE POLICY "Users can read own transcriptions"
      ON transcriptions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own transcriptions'
  ) THEN
    CREATE POLICY "Users can insert own transcriptions"
      ON transcriptions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own transcriptions'
  ) THEN
    CREATE POLICY "Users can update own transcriptions"
      ON transcriptions
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own transcriptions'
  ) THEN
    CREATE POLICY "Users can delete own transcriptions"
      ON transcriptions
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transcriptions_user_id'
  ) THEN
    CREATE INDEX idx_transcriptions_user_id ON transcriptions(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transcriptions_created_at'
  ) THEN
    CREATE INDEX idx_transcriptions_created_at ON transcriptions(created_at DESC);
  END IF;
END $$;

-- Create function to clean up old transcriptions
CREATE OR REPLACE FUNCTION cleanup_old_transcriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM transcriptions
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;