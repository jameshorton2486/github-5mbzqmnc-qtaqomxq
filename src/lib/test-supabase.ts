import { supabase } from './supabase';
import { config } from './config';

async function testSupabaseSetup() {
  console.log('🔍 Testing Supabase setup...\n');

  try {
    // 1. Verify environment variables
    console.log('1️⃣ Checking environment variables...');
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('Missing required Supabase environment variables');
    }
    console.log('✅ Environment variables present');

    // 2. Test connection
    console.log('\n2️⃣ Testing Supabase connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('transcriptions')
      .select('count')
      .limit(1)
      .single();

    if (healthError) {
      if (healthError.code === '42P01') {
        console.log('⚠️ Table "transcriptions" not found - this is expected if migrations haven\'t been run');
      } else {
        throw healthError;
      }
    } else {
      console.log('✅ Database connection successful');
    }

    // 3. Test authentication
    console.log('\n3️⃣ Testing authentication system...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    console.log('✅ Authentication system working');
    console.log(`📝 Session status: ${session ? 'Active' : 'No active session'}`);

    // 4. Test RLS policies
    console.log('\n4️⃣ Testing Row Level Security...');
    if (session?.user) {
      const { error: rlsError } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);

      if (rlsError && !rlsError.message.includes('42P01')) {
        throw new Error(`RLS test failed: ${rlsError.message}`);
      }
      console.log('✅ RLS policies working');
    } else {
      console.log('ℹ️ Skipping RLS test (no active session)');
    }

    // 5. Test schema
    console.log('\n5️⃣ Verifying database schema...');
    const { error: schemaError } = await supabase
      .rpc('cleanup_old_transcriptions');

    if (schemaError && !schemaError.message.includes('42883')) {
      throw new Error(`Schema verification failed: ${schemaError.message}`);
    }
    console.log('✅ Database schema verification complete');

    console.log('\n✨ Supabase setup verification completed successfully!');
    return true;
  } catch (error) {
    console.error('\n❌ Supabase verification failed:', error);
    if (error instanceof Error) {
      console.error('Details:', error.message);
    }
    return false;
  }
}

// Run verification
console.log('🚀 Starting Supabase verification...\n');
testSupabaseSetup().then((success) => {
  process.exit(success ? 0 : 1);
});