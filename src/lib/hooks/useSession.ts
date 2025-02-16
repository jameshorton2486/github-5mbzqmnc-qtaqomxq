import { useEffect, useState, useCallback } from 'react';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { trackSessionActivity } from '../utils/session';

interface SessionState {
  session: Session | null;
  loading: boolean;
  error: Error | null;
  lastActive: Date | null;
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    session: null,
    loading: true,
    error: null,
    lastActive: null,
  });

  const updateActivity = useCallback(async () => {
    if (state.session) {
      try {
        await trackSessionActivity({
          type: 'session_heartbeat',
          metadata: {
            path: window.location.pathname,
            timestamp: new Date().toISOString()
          }
        });
        setState(prev => ({
          ...prev,
          lastActive: new Date()
        }));
      } catch (error) {
        console.error('Failed to update session activity:', error);
      }
    }
  }, [state.session]);

  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState(prev => ({
        ...prev,
        session,
        loading: false,
        error: error || null,
        lastActive: session ? new Date() : null
      }));

      // Start heartbeat if session exists
      if (session) {
        updateActivity();
        heartbeatInterval = setInterval(updateActivity, 5 * 60 * 1000); // Every 5 minutes
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          loading: false,
          lastActive: session ? new Date() : null
        }));

        // Handle session events
        switch (event) {
          case 'SIGNED_IN':
            await trackSessionActivity({
              type: 'sign_in',
              metadata: {
                timestamp: new Date().toISOString()
              }
            });
            if (!heartbeatInterval) {
              heartbeatInterval = setInterval(updateActivity, 5 * 60 * 1000);
            }
            break;
          case 'SIGNED_OUT':
            await trackSessionActivity({
              type: 'sign_out',
              metadata: {
                timestamp: new Date().toISOString()
              }
            });
            if (heartbeatInterval) {
              clearInterval(heartbeatInterval);
            }
            break;
          case 'TOKEN_REFRESHED':
            await trackSessionActivity({
              type: 'token_refresh',
              metadata: {
                timestamp: new Date().toISOString()
              }
            });
            break;
        }
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [updateActivity]);

  return {
    ...state,
    updateActivity
  };
}