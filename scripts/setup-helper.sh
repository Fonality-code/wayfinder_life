#!/bin/bash

echo "🔧 Wayfinder Supabase Setup Helper"
echo "=================================="
echo ""

# Check current environment
echo "📋 Current Environment Status:"
echo "- NEXT_PUBLIC_SUPABASE_URL: ✅ Set"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY: ✅ Set"
echo "- SUPABASE_SERVICE_ROLE_KEY: ❌ Needs replacement"
echo ""

echo "🚨 IMPORTANT: You need to get your Service Role Key"
echo ""
echo "Steps to get your Service Role Key:"
echo "1. Go to: https://supabase.com/dashboard/project/uvffkjlrdhqjyqeuyufq"
echo "2. Click on 'Settings' in the left sidebar"
echo "3. Click on 'API' under Settings"
echo "4. Look for 'Project API keys' section"
echo "5. Copy the 'service_role' key (it's a long JWT token starting with 'eyJ...')"
echo "6. Replace 'YOUR_SERVICE_ROLE_KEY_HERE' in your .env.local file"
echo ""

echo "⚠️  SECURITY NOTE:"
echo "- The service_role key bypasses Row Level Security"
echo "- NEVER expose it in client-side code"
echo "- Keep it secret and only use on the server"
echo ""

echo "📝 After replacing the key, run:"
echo "   npm run dev"
echo ""
echo "🔍 To validate your setup:"
echo "   ./scripts/check-env.sh"
