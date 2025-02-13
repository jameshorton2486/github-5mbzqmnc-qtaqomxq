import { z } from 'zod';
import { supabase, testSupabaseConnection } from './supabase';

// Define environment schema
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(20, 'Invalid Supabase anonymous key'),
  VITE_DEEPGRAM_API_KEY: z.string().min(20, 'Invalid Deepgram API key'),
  PORT: z.string().optional(),
});

async function validateEnvironment() {
  console.log('🔍 Validating environment configuration...');

  try {
    // Validate environment variables
    const env = envSchema.parse({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_DEEPGRAM_API_KEY: import.meta.env.VITE_DEEPGRAM_API_KEY,
      PORT: import.meta.env.PORT,
    });

    console.log('✅ Environment variables validated');

    // Test Supabase connection
    console.log('\n📦 Testing Supabase connection...');
    const supabaseConnected = await testSupabaseConnection();
    if (!supabaseConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    // Test Deepgram API
    console.log('\n🎤 Testing Deepgram API...');
    const deepgramResponse = await fetch('https://api.deepgram.com/v1/projects', {
      headers: {
        'Authorization': `Token ${env.VITE_DEEPGRAM_API_KEY}`,
      }
    });

    if (!deepgramResponse.ok) {
      throw new Error(`Failed to connect to Deepgram: ${deepgramResponse.statusText}`);
    }
    console.log('✅ Deepgram API connection successful');

    console.log('\n✨ All environment validations passed successfully!');
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('\n❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('\n❌ Environment validation failed:', error);
    }
    return false;
  }
}

// Run validation
validateEnvironment().then((success) => {
  process.exit(success ? 0 : 1);
});