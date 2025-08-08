-- Optional: promote the user to admin, then verify.
UPDATE public.profiles
SET role = 'admin'
WHERE id = '8f0a2fa4-cf44-4c56-a64a-85ee53169cb9';

SELECT id, email, role, created_at
FROM public.profiles
WHERE id = '8f0a2fa4-cf44-4c56-a64a-85ee53169cb9';
