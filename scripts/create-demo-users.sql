-- Create demo admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'admin@wayfinder.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Admin User"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create demo regular user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'user@wayfinder.com',
  crypt('user123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Demo User"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert corresponding profiles with admin role for admin user
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  CASE 
    WHEN email = 'admin@wayfinder.com' THEN 'admin'
    ELSE 'user'
  END
FROM auth.users 
WHERE email IN ('admin@wayfinder.com', 'user@wayfinder.com')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;
