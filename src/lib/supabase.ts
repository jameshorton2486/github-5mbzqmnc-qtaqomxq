import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Create Supabase client
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: {
        getItem: (key) => {
          try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            sessionStorage.setItem(key, JSON.stringify(value));
          } catch (error) {
            console.warn('Failed to save auth state:', error);
          }
        },
        removeItem: (key) => {
          try {
            sessionStorage.removeItem(key);
          } catch (error) {
            console.warn('Failed to remove auth state:', error);
          }
        }
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js/2.39.7'
      }
    }
  }
);

// Test Supabase connection and configuration
export const testSupabaseConnection = async () => {
  try {
    // Test database connection
    const { data, error: dbError } = await supabase
      .from('transcriptions')
      .select('id')
      .limit(1);
    
    if (dbError) {
      if (dbError.code === '42P01') {
        console.error('❌ Table "transcriptions" does not exist. Please ensure migrations have been applied.');
      } else {
        console.error('❌ Database error:', dbError.message);
      }
      return false;
    }

    // Test authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Authentication error:', authError.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    console.log(`🔑 Auth status: ${session ? 'Authenticated' : 'Not authenticated'}`);
    console.log(`📝 Found ${data?.length || 0} transcription(s)`);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

// Add auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    console.log('🔑 Auth event:', event);
  } else if (event === 'SIGNED_OUT') {
    sessionStorage.clear();
    console.log('🔒 Signed out, session cleared');
  }
});