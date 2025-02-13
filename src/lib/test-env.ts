import { config } from './config';
import { supabase, supabaseSecondary, testSupabaseConnection } from './supabase';
import { deepgramService } from './deepgram';

async function testEnvironmentSetup() {
  console.log('🔍 Testing environment configuration...\n');

  // 1. Test Primary Supabase Configuration
  console.log('1️⃣ Testing primary Supabase connection...');
  try {
    const connected = await testSupabaseConnection(supabase);
    if (!connected) {
      throw new Error('Failed to connect to primary Supabase instance');
    }
    console.log('✅ Primary Supabase connection successful');
  } catch (error) {
    console.error('❌ Primary Supabase connection failed:', error);
    return false;
  }

  // 2. Test Secondary Supabase Configuration
  console.log('\n2️⃣ Testing secondary Supabase connection...');
  try {
    const connected = await testSupabaseConnection(supabaseSecondary);
    if (!connected) {
      throw new Error('Failed to connect to secondary Supabase instance');
    }
    console.log('✅ Secondary Supabase connection successful');
  } catch (error) {
    console.error('❌ Secondary Supabase connection failed:', error);
    return false;
  }

  // 3. Test Deepgram Configuration
  console.log('\n3️⃣ Testing Deepgram API...');
  try {
    const isHealthy = await deepgramService.healthCheck();
    if (isHealthy) {
      console.log('✅ Deepgram API connection successful');
    } else {
      throw new Error('Failed to connect to Deepgram API');
    }
  } catch (error) {
    console.error('❌ Deepgram API test failed:', error);
    return false;
  }

  // 4. Test Server Configuration
  console.log('\n4️⃣ Verifying server configuration...');
  try {
    const { port, host } = config.server;
    console.log(`📡 Server configured for ${host}:${port}`);
    console.log('✅ Server configuration verified');
  } catch (error) {
    console.error('❌ Server configuration error:', error);
    return false;
  }

  console.log('\n✨ All environment variables verified successfully!');
  return true;
}

// Run the test
console.log('🚀 Starting environment verification...\n');
testEnvironmentSetup().then((success) => {
  if (!success) {
    console.error('\n❌ Environment verification failed');
    process.exit(1);
  }
  console.log('\n🎉 Environment verification completed successfully!');
});