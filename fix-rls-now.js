const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') })

async function executeRlsFix() {
  console.log('🔧 Starting RLS recursion fix...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('SUPABASE_URL:', !!supabaseUrl)
    console.error('SERVICE_KEY:', !!serviceKey)
    return
  }

  // Create admin client with service key
  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    // Read the RLS fix script
    const scriptPath = path.join(__dirname, 'scripts', 'fix-rls-recursion-final.sql')
    const sqlScript = fs.readFileSync(scriptPath, 'utf8')

    console.log('📖 Read RLS fix script, executing...')

    // Execute the script using the RPC approach
    const { data, error } = await supabase.rpc('exec_sql', {
      query: sqlScript
    })

    if (error) {
      console.error('❌ RLS fix failed:', error)

      // Try a simpler approach - just disable RLS on profiles temporarily
      console.log('🔄 Trying simpler fix - disabling RLS on profiles table...')

      const { data: disableData, error: disableError } = await supabase.rpc('exec_sql', {
        query: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;'
      })

      if (disableError) {
        console.error('❌ Failed to disable RLS:', disableError)
        console.log('\n📋 MANUAL FIX REQUIRED:')
        console.log('1. Go to your Supabase dashboard')
        console.log('2. Open SQL Editor')
        console.log('3. Execute: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
        console.log('4. Then run the full fix script: scripts/fix-rls-recursion-final.sql')
      } else {
        console.log('✅ RLS disabled on profiles table as temporary fix')
        console.log('⚠️  Remember to run the full fix script later for proper security')
      }
    } else {
      console.log('✅ RLS recursion fix completed successfully!')
    }

  } catch (error) {
    console.error('❌ Script execution error:', error)
    console.log('\n📋 MANUAL EXECUTION REQUIRED:')
    console.log('Execute this SQL in Supabase dashboard:')
    console.log('ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
  }
}

executeRlsFix()
