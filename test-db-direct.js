require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testing Supabase connection...');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL missing');
  process.exit(1);
}

if (!serviceKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('   URL:', url);
console.log('   Service Key:', serviceKey.substring(0, 20) + '...');

const supabase = createClient(url, serviceKey);

async function testConnection() {
  try {
    console.log('\n🔍 Testing database connection...');

    // Test 1: Query profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('email', 'ivan8tana@gmail.com')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles query failed:', profilesError.message);
      return;
    }

    console.log('✅ Profiles query successful');

    if (!profiles || profiles.length === 0) {
      console.log('❌ No profile found for ivan8tana@gmail.com');

      // Let's check what profiles exist
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .limit(10);

      if (allError) {
        console.log('❌ Cannot query all profiles:', allError.message);
      } else {
        console.log('📋 All profiles in database:');
        allProfiles.forEach(p => {
          console.log(`   ${p.email} (${p.role}) - ID: ${p.id.substring(0, 8)}...`);
        });
      }

      return;
    }

    const profile = profiles[0];
    console.log('✅ Profile found:');
    console.log('   ID:', profile.id);
    console.log('   Email:', profile.email);
    console.log('   Role:', profile.role);
    console.log('   Created:', profile.created_at);

    if (profile.role === 'admin') {
      console.log('✅ User has ADMIN role - database is correct!');
    } else {
      console.log('❌ User does NOT have admin role');

      // Try to set admin role
      console.log('🔧 Attempting to set admin role...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', profile.id);

      if (updateError) {
        console.log('❌ Failed to update role:', updateError.message);
      } else {
        console.log('✅ Role updated to admin');
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testConnection();
