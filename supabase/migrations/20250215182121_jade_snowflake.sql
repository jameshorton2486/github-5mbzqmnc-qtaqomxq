/*
  # Fix Cron Schema Setup

  1. Changes
    - Create extensions schema
    - Enable pg_cron extension
    - Create cron schema
    - Grant necessary permissions
    - Update search path

  2. Security
    - Grant minimal required permissions
    - Ensure secure schema setup
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
ALTER DATABASE postgres SET search_path TO public, extensions, cron;

-- Ensure pg_cron is accessible
GRANT USAGE ON SCHEMA extensions TO postgres;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;

-- Grant execute on pg_cron functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO service_role;