#!/bin/bash

# Environment Variables Validation Script for Wayfinder
echo "🔍 Checking Wayfinder Environment Configuration..."
echo "=================================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local file in the project root."
    exit 1
fi

# Source the .env.local file
set -a
source .env.local 2>/dev/null
set +a

# Required variables
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

ALL_GOOD=true

echo "✅ Required Environment Variables:"
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var is missing or empty"
        ALL_GOOD=false
    elif [[ "${!var}" == *"YOUR_"*"_HERE"* ]]; then
        echo "❌ $var contains placeholder value - please replace with actual value"
        echo "   See scripts/get-service-key.md for instructions"
        ALL_GOOD=false
    else
        # Show first few chars for verification without exposing secrets
        value="${!var}"
        if [[ ${#value} -gt 20 ]]; then
            preview="${value:0:10}...${value: -4}"
        else
            preview="${value:0:8}..."
        fi
        echo "✅ $var = $preview"
    fi
done

echo ""
echo "=================================================="

if [ "$ALL_GOOD" = true ]; then
    echo "🎉 All required environment variables are properly configured!"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' to start the development server"
    echo "2. Visit http://localhost:3000 to test your application"
else
    echo "❌ Some environment variables need attention."
    echo ""
    echo "Please check:"
    echo "1. Follow instructions in scripts/get-service-key.md"
    echo "2. Replace YOUR_SERVICE_ROLE_KEY_HERE with actual service role key"
    echo "3. Verify your Supabase project URL and keys are correct"
fi

echo "=================================================="
    echo "❌ .env.local file not found!"
    echo "Please create a .env.local file based on .env.example"
    echo "Run: cp .env.example .env.local"
    exit 1
fi

echo "✅ Found .env.local file"

# Check for required environment variables
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local || grep -q "^${var}=.*your-.*-here" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All required environment variables are set"
else
    echo "❌ Missing or incomplete environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update your .env.local file with the correct values from your Supabase project."
    echo "You can find these in your Supabase project settings > API."
    exit 1
fi

# Check if we can connect to Supabase
echo ""
echo "🔍 Testing Supabase connection..."

# Use Node.js to test the connection
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

supabase.from('profiles').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Supabase connection successful!');
    }
  })
  .catch((err) => {
    console.log('❌ Connection test failed:', err.message);
    process.exit(1);
  });
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Environment setup complete!"
    echo "You can now run: npm run dev"
else
    echo ""
    echo "❌ Could not test connection (this is normal if you haven't installed dependencies yet)"
    echo "Make sure to run: npm install"
    echo "Then test your setup by running: npm run dev"
fi
