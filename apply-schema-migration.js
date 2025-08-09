const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') })

async function applySchemaUpdate() {
  console.log('🔧 Starting schema migration...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('SUPABASE_URL:', !!supabaseUrl)
    console.error('SERVICE_KEY:', !!serviceKey)
    return
  }

  // Create admin client with service key
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('📋 Checking current packages table structure...')

    // First, test if we can access the packages table
    const { data: testPackages, error: testError } = await supabase
      .from('packages')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Cannot access packages table:', testError.message)
      return
    }

    console.log('✅ Packages table accessible')

    // Read the schema update script
    const scriptPath = path.join(__dirname, 'scripts', 'update-packages-schema.sql')
    const sqlScript = fs.readFileSync(scriptPath, 'utf8')

    console.log('📖 Schema update script loaded')
    console.log('⚠️  Note: This script will be executed manually')
    console.log('')
    console.log('📋 MANUAL SCHEMA UPDATE REQUIRED:')
    console.log('1. Go to your Supabase Dashboard → SQL Editor')
    console.log('2. Copy and execute the following script:')
    console.log('   scripts/update-packages-schema.sql')
    console.log('')
    console.log('💡 Key changes this will make:')
    console.log('   • Add user_id column to packages table')
    console.log('   • Add carrier, recipient_email, origin, destination columns')
    console.log('   • Add current_location, estimated_delivery, dimensions, notes columns')
    console.log('   • Update status constraint to include modern statuses')
    console.log('')
    console.log('⚡ After running the script, restart your dev server and try adding a package again')

  } catch (error) {
    console.error('❌ Schema check error:', error.message)
    console.log('📋 MANUAL EXECUTION REQUIRED:')
    console.log('Execute scripts/update-packages-schema.sql in Supabase dashboard')
  }
}

applySchemaUpdate()
