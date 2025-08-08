# 🚀 Wayfinder Setup with pnpm

## Quick Start

You're almost ready! Just one more step needed.

### 1. Get Your Service Role Key

**You need to replace `YOUR_SERVICE_ROLE_KEY_HERE` in your `.env.local` file:**

1. Visit: https://supabase.com/dashboard/project/uvffkjlrdhqjyqeuyufq
2. Go to **Settings** → **API**
3. Copy the **service_role** key (long JWT starting with `eyJ...`)
4. Replace `YOUR_SERVICE_ROLE_KEY_HERE` in your `.env.local` file

### 2. Complete Setup

```bash
# Install dependencies
pnpm install

# Check environment (should pass after step 1)
pnpm run env:check

# Start development server
pnpm run dev
```

### 3. Database Setup

Copy the contents of `scripts/comprehensive-setup.sql` into your Supabase SQL Editor and run it.

## Available Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run env:check    # Validate environment variables
pnpm run env:setup    # Run full setup helper
pnpm run type-check   # Check TypeScript types
pnpm run clean        # Clean and reinstall dependencies
```

## What's Fixed

✅ **Environment Variables**: Properly configured Supabase URLs and keys
✅ **TypeScript Types**: Fixed authentication and role types
✅ **Supabase Clients**: Consistent client setup (browser, server, admin)
✅ **Authentication**: Cleaned up auth flows and role management
✅ **Database Schema**: Comprehensive SQL setup script
✅ **Package Scripts**: Added helpful pnpm scripts

## Project Structure

```
lib/supabase/
├── client.ts      # Browser client
├── server.ts      # Server client with cookies
└── admin.ts       # Admin client (service role)

lib/auth/
├── role.ts        # Role utilities
└── get-user-with-role.ts  # User fetching

scripts/
├── comprehensive-setup.sql  # Complete DB setup
├── check-env.sh            # Environment validation
└── setup-helper.sh         # Full setup script
```

## Next Steps

After completing the service role key:

1. **Start Development**: `pnpm run dev`
2. **Test Authentication**: Visit `/auth` to sign up/login
3. **Check Admin Access**: First user becomes admin automatically
4. **Explore Features**: Package tracking, route management, user dashboard

## Need Help?

- Environment issues: Run `pnpm run env:check`
- Database issues: Check Supabase dashboard
- Type errors: Run `pnpm run type-check`
- Start fresh: Run `pnpm run clean`
