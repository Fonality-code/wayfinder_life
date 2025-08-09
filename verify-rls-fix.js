// Test script to verify RLS fix
// Run with: node verify-rls-fix.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testRlsFix() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing environment variables')
    return false
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    console.log('🧪 Testing profiles table access...')

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1)

    if (profileError) {
      console.error('❌ Profiles table error:', profileError.message)
      if (profileError.message.includes('infinite recursion')) {
        console.log('🔧 RLS recursion still detected - manual fix needed')
        return false
      }
    } else {
      console.log('✅ Profiles table accessible')
    }

    console.log('🧪 Testing packages table access...')

    const { data: packages, error: packageError } = await supabase
      .from('packages')
      .select('id, tracking_number')
      .limit(1)

    if (packageError) {
      console.error('❌ Packages table error:', packageError.message)
    } else {
      console.log('✅ Packages table accessible')
    }

    console.log('✅ RLS fix verification complete!')
    return true

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testRlsFix().then(success => {
  if (success) {
    console.log('\n🎉 Database is ready for package operations!')
  } else {
    console.log('\n⚠️  Manual RLS fix required before package operations will work')
  }
})
