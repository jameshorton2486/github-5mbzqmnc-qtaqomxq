import { useState, useEffect } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { TEST_USER } from '../lib/test-user';
import { logger } from '../lib/logger';
import { handleError, AppError } from '../lib/error-handler';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // In development, automatically set the test user
    if (import.meta.env.DEV) {
      setAuthState(state => ({
        ...state,
        user: TEST_USER,
        loading: false,
      }));
      return;
    }

    // Get initial session
    const initAuth = async () => {
      try {
        logger.time('Auth initialization');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        setAuthState(state => ({
          ...state,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
        
        logger.info('Auth initialized successfully', {
          userId: session?.user?.id,
          isAuthenticated: !!session
        });
      } catch (error) {
        handleError(error, { context: 'Auth initialization' });
        setAuthState(state => ({
          ...state,
          error: error as Error,
          loading: false,
        }));
      } finally {
        logger.timeEnd('Auth initialization');
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed', { event, userId: session?.user?.id });
        
        setAuthState(state => ({
          ...state,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      logger.time('Sign in');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: undefined // Disable captcha for development
        }
      });

      if (error) {
        throw new AppError(error.message, 'AUTH_SIGNIN_ERROR', {
          email,
          errorCode: error.status
        });
      }

      logger.info('User signed in successfully', {
        userId: data.user?.id,
        email: data.user?.email
      });

      return data;
    } catch (error) {
      handleError(error, { context: 'Sign in', email });
      throw error;
    } finally {
      logger.timeEnd('Sign in');
    }
  };

  const signOut = async () => {
    if (import.meta.env.DEV) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      logger.time('Sign out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new AppError(error.message, 'AUTH_SIGNOUT_ERROR', {
          userId: authState.user?.id
        });
      }

      logger.info('User signed out successfully', {
        userId: authState.user?.id
      });
    } catch (error) {
      handleError(error, { context: 'Sign out', userId: authState.user?.id });
      throw error;
    } finally {
      logger.timeEnd('Sign out');
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
}