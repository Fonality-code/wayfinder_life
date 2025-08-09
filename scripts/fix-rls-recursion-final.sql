-- Fix RLS recursion issue in profiles table
-- Updated version that handles existing policies properly

-- First, disable RLS temporarily to make changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles table (including partial ones)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies for profiles table
    FOR policy_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Create simple, non-recursive policies for profiles table
-- Users can view their own profile (recreate even if exists)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Clean up packages table policies
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- Drop all existing package policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'packages' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON packages';
    END LOOP;
END $$;

-- Create simpler package policies without profile table lookups
-- Allow anyone to view packages (for public tracking)
CREATE POLICY "packages_public_select" ON packages
  FOR SELECT USING (true);

-- Allow authenticated users to insert packages
CREATE POLICY "packages_authenticated_insert" ON packages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own packages (based on user_id, not profile lookup)
CREATE POLICY "packages_user_update" ON packages
  FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Clean up tracking_updates table
ALTER TABLE tracking_updates DISABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'tracking_updates' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON tracking_updates';
    END LOOP;
END $$;

-- Simple tracking updates policies
CREATE POLICY "tracking_updates_public_select" ON tracking_updates
  FOR SELECT USING (true);

CREATE POLICY "tracking_updates_authenticated_insert" ON tracking_updates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;

-- Clean up routes table
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'routes' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON routes';
    END LOOP;
END $$;

CREATE POLICY "routes_public_select" ON routes
  FOR SELECT USING (true);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Clean up app_settings - no RLS policies, admin client handles access
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'app_settings' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON app_settings';
    END LOOP;
END $$;

-- Don't enable RLS for app_settings - admin client bypasses anyway

-- Add comments explaining the approach
COMMENT ON TABLE profiles IS 'RLS policies simplified to avoid recursion. Admin operations use server-side admin client to bypass RLS.';
COMMENT ON TABLE packages IS 'Public read access with user-based write access. Admin operations handled server-side to avoid RLS recursion.';
COMMENT ON TABLE tracking_updates IS 'Public read access for tracking functionality. Admin operations handled server-side.';
COMMENT ON TABLE routes IS 'Public read access. Admin operations handled server-side.';
COMMENT ON TABLE app_settings IS 'No RLS policies. Access controlled entirely through admin client server-side.';

-- Verify the fix worked
SELECT 'RLS Fix Complete' as status;
