/*
  # Cron Extension Setup

  1. Features
    - Enable pg_cron extension
    - Create cron schema if it doesn't exist
    - Add cron schema to search path

  2. Security
    - Grant necessary permissions
*/

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable pg_cron extension in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Create cron schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS cron;

-- Grant usage on cron schema
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT USAGE ON SCHEMA cron TO authenticated;
GRANT USAGE ON SCHEMA cron TO service_role;

-- Add cron schema to search path
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_namespace 
    WHERE nspname = 'cron'
  ) THEN
    ALTER DATABASE postgres SET search_path TO public, extensions, cron;
  END IF;
END $$;