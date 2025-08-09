#!/bin/bash

echo "🔍 Testing Authentication Status"
echo "================================"

echo "1. Testing if user is logged in (browser cookies)..."
echo "   Open your browser and go to: http://localhost:3000"
echo "   Check if you're logged in. If not, sign in first."
echo ""

echo "2. Testing with browser session..."
echo "   After logging in, try these URLs in your browser:"
echo "   - http://localhost:3000/api/auth/role"
echo "   - http://localhost:3000/api/debug/role"
echo "   - http://localhost:3000/dashboard/profile"
echo ""

echo "3. If you see 'Auth session missing', try these fixes:"
echo ""
echo "   Fix 1: Clear browser cookies and log in again"
echo "   Fix 2: Check if the authentication is working"
echo ""

echo "4. Manual login test:"
echo "   Go to: http://localhost:3000/auth"
echo "   Try logging in with one of these admin accounts:"

# Get admin emails from database
cd /home/ivantana/codebase/professional/wayfinder

node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function getAdminEmails() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabase
    .from('profiles')
    .select('email, role')
    .eq('role', 'admin');

  if (data) {
    data.forEach(profile => {
      console.log('   - ' + profile.email);
    });
  }
}

getAdminEmails().catch(() => {});
" 2>/dev/null || echo "   - Check your database for admin emails"

echo ""
echo "5. After logging in successfully, test the admin access:"
echo "   - Go to: http://localhost:3000/admin"
echo "   - Should show admin dashboard instead of 403 error"
echo ""
echo "================================"
