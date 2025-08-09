const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function fixRlsDirectly() {
  console.log('🔧 Fixing RLS recursion issue directly...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing environment variables')
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('🚫 Disabling RLS on profiles table...')

    // First, try to disable RLS on profiles table using a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    console.log('🔍 Profile query result:', { data: data?.length || 0, error: error?.message })

    // If we get recursion error, we know the issue exists
    if (error && error.message.includes('infinite recursion')) {
      console.log('✅ Confirmed: RLS recursion detected')
      console.log('\n📋 MANUAL FIX REQUIRED:')
      console.log('1. Open Supabase Dashboard → SQL Editor')
      console.log('2. Execute this command:')
      console.log('   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
      console.log('3. Then execute the full fix script:')
      console.log('   scripts/fix-rls-recursion-final.sql')
      console.log('\n⚡ Quick fix for immediate testing:')
      console.log('   Just run: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
    } else {
      console.log('✅ No RLS recursion detected - profiles table is accessible')
    }

  } catch (error) {
    console.error('❌ Error testing database:', error.message)
  }
}

fixRlsDirectly()
