#!/bin/bash

# Diagnostic script to debug admin role issues
echo "🔍 Debugging Admin Role Detection"
echo "=================================="

cd /home/ivantana/codebase/professional/wayfinder

# Check if user is authenticated and get user ID
echo "1. Testing API endpoints..."

# Test the auth role endpoint
echo "📡 Testing /api/auth/role endpoint..."
curl -s http://localhost:3000/api/auth/role | jq '.' 2>/dev/null || echo "❌ API not responding or jq not available"

echo ""
echo "2. Testing Supabase connection with service role..."

# Create a temporary script to test the service role
cat > temp_test_role.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testRole() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('📊 Testing direct database access...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, created_at')
    .limit(5);

  if (error) {
    console.log('❌ Error:', error.message);
  } else {
    console.log('✅ Found profiles:', data?.length || 0);
    data?.forEach(profile => {
      console.log(`  - ${profile.email}: ${profile.role} (${profile.id})`);
    });
  }

  // Test auth.users access
  console.log('\n📊 Testing auth.users access...');
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.log('❌ Auth error:', authError.message);
  } else {
    console.log('✅ Found auth users:', authData?.users?.length || 0);
    authData?.users?.forEach(user => {
      console.log(`  - ${user.email}: ${user.id}`);
    });
  }
}

testRole().catch(console.error);
EOF

echo "Running database test..."
node temp_test_role.js

# Clean up
rm temp_test_role.js

echo ""
echo "3. Environment check..."
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."

echo ""
echo "4. Checking for common issues..."

# Check if profiles table has the correct structure
echo "📋 You should manually verify in Supabase:"
echo "   1. Go to Table Editor -> profiles"
echo "   2. Check if your user's role column shows 'admin'"
echo "   3. Verify the user ID matches between auth.users and profiles"
echo ""
echo "5. Manual verification SQL:"
echo "   SELECT u.id, u.email as auth_email, p.email as profile_email, p.role"
echo "   FROM auth.users u"
echo "   LEFT JOIN public.profiles p ON u.id = p.id"
echo "   ORDER BY u.created_at DESC;"

echo ""
echo "=================================="
