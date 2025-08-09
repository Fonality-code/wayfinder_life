const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verifyDatabaseFixes() {
  console.log('🧪 Verifying database fixes...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing environment variables')
    return false
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  let allGood = true

  try {
    // Test 1: Check profiles table access (RLS fix)
    console.log('🔍 Testing profiles table access...')
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1)

    if (profileError) {
      if (profileError.message.includes('infinite recursion')) {
        console.error('❌ RLS recursion still present - need to run RLS fix')
        allGood = false
      } else {
        console.error('❌ Profiles table error:', profileError.message)
        allGood = false
      }
    } else {
      console.log('✅ Profiles table accessible')
    }

    // Test 2: Check packages table schema
    console.log('🔍 Testing packages table schema...')
    const { data: packages, error: packageError } = await supabase
      .from('packages')
      .select('id, tracking_number, user_id, carrier, recipient_email')
      .limit(1)

    if (packageError) {
      if (packageError.message.includes('user_id')) {
        console.error('❌ user_id column missing - need to run schema migration')
        allGood = false
      } else if (packageError.message.includes('carrier')) {
        console.error('❌ carrier column missing - need to run schema migration')
        allGood = false
      } else {
        console.error('❌ Packages table error:', packageError.message)
        allGood = false
      }
    } else {
      console.log('✅ Packages table schema updated')
    }

    // Test 3: Check if we can create a test package
    console.log('🔍 Testing package creation...')
    const testTracking = `TEST-${Date.now()}`

    const { data: newPackage, error: createError } = await supabase
      .from('packages')
      .insert({
        tracking_number: testTracking,
        carrier: 'TEST',
        sender_name: 'Test Sender',
        sender_address: 'Test Address',
        recipient_name: 'Test Recipient',
        recipient_address: 'Test Recipient Address',
        recipient_email: 'test@example.com',
        package_type: 'test',
        status: 'pending',
        user_id: null // Using null for test
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ Package creation failed:', createError.message)
      allGood = false
    } else {
      console.log('✅ Package creation successful')

      // Clean up test package
      await supabase
        .from('packages')
        .delete()
        .eq('id', newPackage.id)
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    allGood = false
  }

  console.log('\n' + '='.repeat(50))
  if (allGood) {
    console.log('🎉 All database fixes verified successfully!')
    console.log('✅ You can now use the package creation feature')
  } else {
    console.log('⚠️  Database fixes still needed:')
    console.log('1. Execute RLS fix: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
    console.log('2. Execute schema migration: scripts/update-packages-schema.sql')
  }
  console.log('='.repeat(50))

  return allGood
}

verifyDatabaseFixes()
