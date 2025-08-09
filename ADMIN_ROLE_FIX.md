# 🔧 Admin Role Issues - Troubleshooting Guide

## Current Status
✅ **Database**: 3 admin users found (including ivan8tana@gmail.com)
❌ **Authentication**: Session missing from API calls

## Quick Fix Steps:

### 1. **Clear Browser Data & Re-login**
```bash
# Clear cookies and try fresh login
1. Open browser dev tools (F12)
2. Go to Application > Storage > Clear site data
3. Go to http://localhost:3000/auth
4. Sign in with: ivan8tana@gmail.com
```

### 2. **Test Authentication**
```bash
# After signing in, test these URLs:
- http://localhost:3000/debug          # Debug console
- http://localhost:3000/api/auth/role  # Should show role: "admin"
- http://localhost:3000/admin          # Should show admin dashboard
```

### 3. **If Still Not Working - Environment Issue**
```bash
# Restart dev server with fresh environment
pnpm run dev
```

### 4. **Manual Database Check**
If you need to manually set admin role:
```sql
-- Run this in Supabase SQL Editor:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'ivan8tana@gmail.com';

-- Verify:
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
```

## Root Cause
The issue is **authentication session management**, not the database or role detection logic. The user has admin role in database but browser session isn't being sent to server APIs.

## Next Steps After Login:
1. ✅ Debug page should show "Authenticated"
2. ✅ Role should show "admin"
3. ✅ `/admin` should work without 403 error
4. ✅ All admin features should be accessible

## Files Created for Debugging:
- `/debug` - Interactive debug console
- `/api/debug/profiles` - Database role checker
- `/api/debug/role` - Role detection tester
- `scripts/test-auth.sh` - Authentication test guide
