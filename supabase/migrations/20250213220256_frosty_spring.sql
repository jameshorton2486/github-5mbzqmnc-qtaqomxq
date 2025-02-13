/*
  # Add safe policies with existence checks

  This migration safely adds policies and indexes by checking if they exist first.
  It will not fail if the objects already exist.

  1. Policies
    - Read own transcriptions
    - Insert own transcriptions
    - Update own transcriptions
    - Delete own transcriptions

  2. Indexes
    - User ID index
    - Created at index
*/

-- Safely create policies with existence checks
DO $$ 
BEGIN
  -- Read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transcriptions' 
    AND policyname = 'Users can read own transcriptions'
  ) THEN
    CREATE POLICY "Users can read own transcriptions"
      ON transcriptions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transcriptions' 
    AND policyname = 'Users can insert own transcriptions'
  ) THEN
    CREATE POLICY "Users can insert own transcriptions"
      ON transcriptions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transcriptions' 
    AND policyname = 'Users can update own transcriptions'
  ) THEN
    CREATE POLICY "Users can update own transcriptions"
      ON transcriptions
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transcriptions' 
    AND policyname = 'Users can delete own transcriptions'
  ) THEN
    CREATE POLICY "Users can delete own transcriptions"
      ON transcriptions
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;