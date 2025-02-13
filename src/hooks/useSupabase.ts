import { useState, useEffect } from 'react';
import { supabase, supabaseSecondary } from '../lib/supabase';

export type SupabaseInstance = 'primary' | 'secondary';

export function useSupabase(instance: SupabaseInstance = 'primary') {
  const [client, setClient] = useState(instance === 'primary' ? supabase : supabaseSecondary);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (instance === 'secondary' && !supabaseSecondary) {
      setError(new Error('Secondary Supabase instance is not configured'));
      return;
    }
    setClient(instance === 'primary' ? supabase : supabaseSecondary);
  }, [instance]);

  return {
    client,
    error,
    isPrimary: instance === 'primary',
    isSecondary: instance === 'secondary',
  };
}