import { type User } from '@supabase/supabase-js';

export const TEST_USER: User = {
  id: 'test-user-id',
  app_metadata: {
    provider: 'email',
  },
  user_metadata: {
    full_name: 'Test User',
    role: 'admin',
    phone: '555-0123',
    law_firm: 'Test Law Firm',
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'test@kollect-it.com',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};