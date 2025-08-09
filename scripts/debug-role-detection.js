const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function debugRoleDetection() {
  console.log('🔍 Debugging Role Detection');
  console.log('===========================');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.log('❌ Missing environment variables');
    console.log('URL:', !!url);
    console.log('Service Key:', !!serviceKey);
    return;
  }

  console.log('✅ Environment variables found');
  console.log('URL:', url);
  console.log('Service Key:', serviceKey.substring(0, 20) + '...');

  // Create admin client
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Test 1: List all profiles
    console.log('\n📊 Testing profiles access...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.log('❌ Profiles error:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles:`);
      profiles?.forEach(profile => {
        console.log(`  - ${profile.email || 'no-email'}: ${profile.role || 'no-role'} (ID: ${profile.id})`);
      });
    }

    // Test 2: Check admin users specifically
    console.log('\n👑 Looking for admin users...');
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('role', 'admin');

    if (adminError) {
      console.log('❌ Admin query error:', adminError.message);
    } else {
      console.log(`✅ Found ${adminProfiles?.length || 0} admin profiles:`);
      adminProfiles?.forEach(profile => {
        console.log(`  - ${profile.email}: ${profile.role} (ID: ${profile.id})`);
      });
    }

    // Test 3: List auth users
    console.log('\n🔐 Testing auth users access...');
    const { data: authResult, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log(`✅ Found ${authResult?.users?.length || 0} auth users:`);
      authResult?.users?.forEach(user => {
        console.log(`  - ${user.email}: ${user.id}`);
      });
    }

    // Test 4: Cross-reference auth users with profiles
    if (profiles && authResult?.users) {
      console.log('\n🔗 Cross-referencing auth users with profiles...');
      authResult.users.forEach(user => {
        const profile = profiles.find(p => p.id === user.id);
        if (profile) {
          console.log(`  ✅ ${user.email}: role = ${profile.role || 'null'}`);
        } else {
          console.log(`  ❌ ${user.email}: NO PROFILE FOUND`);
        }
      });
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n===========================');
  console.log('Debug complete!');
}

debugRoleDetection();
