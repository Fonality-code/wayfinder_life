# Supabase Setup for Wayfinder

## 🚀 Quick Setup Guide

### 1. Get Your Supabase Service Role Key

**IMPORTANT**: You need to replace `YOUR_SERVICE_ROLE_KEY_HERE` in your `.env.local` file.

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/uvffkjlrdhqjyqeuyufq)
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (starts with `eyJ...`)
4. Replace `YOUR_SERVICE_ROLE_KEY_HERE` in `.env.local`

### 2. Verify Environment Setup

Run the environment check script:
```bash
chmod +x scripts/check-env.sh
./scripts/check-env.sh
```

### 3. Database Setup

Run the comprehensive database setup:
```bash
# Execute the database setup script in Supabase SQL Editor
# Copy and paste the contents of scripts/comprehensive-setup.sql
```

### 4. Test Your Setup

```bash
npm run dev
```

Visit `http://localhost:3000` and try:
- Creating an account
- Logging in
- Accessing the dashboard

## 🔧 Environment Variables Explained

### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key (safe for client)
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only admin key (NEVER expose to client)

### Database Variables (Optional):
- `POSTGRES_*`: Direct database connection details

## 🛠️ Common Issues

### "Missing SUPABASE_SERVICE_ROLE_KEY" Error
- Make sure you replaced the placeholder with the actual key from Supabase dashboard

### Authentication Not Working
- Check that your Supabase project has authentication enabled
- Verify Row Level Security policies are set up correctly

### Database Connection Issues
- Ensure your Supabase project is not paused
- Check that the database schema is set up correctly

## 📁 File Structure

```
lib/supabase/
├── client.ts      # Browser client (uses public keys)
├── server.ts      # Server client (uses public keys + cookies)
└── admin.ts       # Admin client (uses service role key)

lib/auth/
├── role.ts        # Role management utilities
└── get-user-with-role.ts  # User and role fetching

scripts/
├── comprehensive-setup.sql    # Complete database setup
├── check-env.sh              # Environment validation
└── get-service-key.md        # Instructions for service key
```

## 🔐 Security Notes

- The service role key bypasses Row Level Security (RLS)
- Only use it on the server side, never in client components
- Keep your `.env.local` file in `.gitignore` (it should be already)

## 🆘 Need Help?

1. Check the environment variables with `./scripts/check-env.sh`
2. Review the Supabase dashboard for any configuration issues
3. Check browser console and server logs for error messages
