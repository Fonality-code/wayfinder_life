-- Optional: baseline RLS for public.profiles to avoid recursion issues.
-- Enable RLS (if not already enabled).
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing simple policies to recreate cleanly.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Allow authenticated users to select their own row.
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to update their own row (e.g., full_name, avatar_url).
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- We intentionally do NOT create an INSERT policy here.
-- Profile creation is handled server-side with a service-role client
-- to avoid "infinite recursion detected in policy" errors.
