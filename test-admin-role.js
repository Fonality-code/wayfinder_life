const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAdminRole() {
  console.log('🔍 Testing Admin Role Detection...');
  console.log('====================================');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.log('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Test 1: Check all profiles
    console.log('📊 Checking all profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at, full_name')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.log('❌ Error fetching profiles:', profilesError.message);
      return;
    }

    console.log(`✅ Found ${profiles.length} profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. Email: ${profile.email || 'null'}`);
      console.log(`   Role: ${profile.role || 'null'}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Name: ${profile.full_name || 'null'}`);
      console.log('');
    });

    // Test 2: Check specifically for admin roles
    console.log('👑 Checking for admin profiles...');
    const adminProfiles = profiles.filter(p => p.role === 'admin');

    if (adminProfiles.length === 0) {
      console.log('❌ No admin profiles found');
      console.log('💡 Solution: Update a profile to have admin role');
      console.log('   SQL: UPDATE public.profiles SET role = \'admin\' WHERE email = \'your-email@example.com\';');
    } else {
      console.log(`✅ Found ${adminProfiles.length} admin profile(s):`);
      adminProfiles.forEach(profile => {
        console.log(`   - ${profile.email}: ${profile.role} (ID: ${profile.id})`);
      });
    }

    // Test 3: Check auth users
    console.log('🔐 Checking auth users...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Error fetching auth users:', authError.message);
    } else {
      console.log(`✅ Found ${authData.users.length} auth users:`);
      authData.users.forEach((user, index) => {
        const profile = profiles.find(p => p.id === user.id);
        console.log(`${index + 1}. ${user.email} (${user.id})`);
        if (profile) {
          console.log(`   Profile role: ${profile.role || 'null'}`);
        } else {
          console.log('   ❌ No profile found - this user needs a profile!');
        }
        console.log('');
      });
    }

    // Test 4: REST API test
    console.log('🌐 Testing REST API access...');
    const restUrl = `${url}/rest/v1/profiles?select=id,email,role&role=eq.admin`;
    const response = await fetch(restUrl, {
      headers: {
        'apikey': serviceKey,
        'authorization': `Bearer ${serviceKey}`,
        'content-type': 'application/json'
      }
    });

    if (response.ok) {
      const restData = await response.json();
      console.log('✅ REST API response:', JSON.stringify(restData, null, 2));
    } else {
      console.log('❌ REST API error:', response.status, response.statusText);
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('====================================');
  console.log('🎯 If you see a user but their role is null or "user",');
  console.log('   run this SQL in Supabase to make them admin:');
  console.log('');
  console.log('   UPDATE public.profiles');
  console.log('   SET role = \'admin\'');
  console.log('   WHERE email = \'YOUR_EMAIL_HERE\';');
  console.log('');
}

testAdminRole().catch(console.error);
