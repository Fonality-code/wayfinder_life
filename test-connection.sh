#!/bin/bash

echo "🔍 Testing Supabase Authentication and Database Connection"
echo "================================================"

# Test environment variables
echo "✓ Environment Variables:"
echo "  NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
echo "  SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."

echo ""

# Test direct database connection using service role
echo "🔍 Testing direct database access..."

node -e "
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  try {
    console.log('🔍 Testing service role database access...');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', 'ivan8tana@gmail.com');

    if (error) {
      console.log('❌ Database error:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('❌ No profile found for ivan8tana@gmail.com');
      return;
    }

    console.log('✅ Profile found:');
    console.log('  ID:', data[0].id);
    console.log('  Email:', data[0].email);
    console.log('  Role:', data[0].role);

    if (data[0].role === 'admin') {
      console.log('✅ User has admin role in database');
    } else {
      console.log('❌ User does NOT have admin role in database');
    }

  } catch (err) {
    console.log('❌ Test failed:', err.message);
  }
}

test();
"

echo ""
echo "🔍 Next steps:"
echo "1. Open browser to http://localhost:3000/auth"
echo "2. Sign in with: ivan8tana@gmail.com"
echo "3. Test http://localhost:3000/debug"
echo "4. Test http://localhost:3000/admin"
