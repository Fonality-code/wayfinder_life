-- First, let's make sure the demo users exist in auth.users
-- Note: This might need to be run in Supabase SQL editor with proper permissions

-- Update existing profiles to ensure admin user has admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@wayfinder.com';

UPDATE profiles 
SET role = 'user' 
WHERE email = 'user@wayfinder.com';

-- If profiles don't exist, create them (this assumes the auth.users already exist)
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Demo User'),
  CASE 
    WHEN au.email = 'admin@wayfinder.com' THEN 'admin'
    ELSE 'user'
  END
FROM auth.users au
WHERE au.email IN ('admin@wayfinder.com', 'user@wayfinder.com')
  AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = au.id
  );
