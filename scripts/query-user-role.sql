-- Query the role for a specific user in public.profiles
-- Replace the UUID if needed.
SELECT
  id,
  email,
  role,
  created_at
FROM public.profiles
WHERE id = '8f0a2fa4-cf44-4c56-a64a-85ee53169cb9';
