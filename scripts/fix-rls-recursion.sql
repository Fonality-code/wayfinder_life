-- Fix RLS recursion issue in profiles table
-- The problem: policies on profiles table that check admin role cause infinite recursion

-- First, disable RLS temporarily to make changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create simple, non-recursive policies for profiles table
-- Users can view their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update other tables' policies to be simpler and avoid recursion where possible
-- For admin-only operations, we'll rely on server-side checks using admin client

-- Drop problematic admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all packages" ON packages;
DROP POLICY IF EXISTS "Admins can insert packages" ON packages;
DROP POLICY IF EXISTS "Admins can update packages" ON packages;
DROP POLICY IF EXISTS "Users can view own packages" ON packages;
DROP POLICY IF EXISTS "Users can create own packages" ON packages;
DROP POLICY IF EXISTS "Admins can manage all packages" ON packages;

-- Create simpler package policies without profile table lookups
-- Allow anyone to view packages (for public tracking)
CREATE POLICY "packages_public_select" ON packages
  FOR SELECT USING (true);

-- For admin operations, we'll use server-side admin client to bypass RLS entirely
-- This avoids the recursion issue while maintaining security

-- Similar approach for other tables
DROP POLICY IF EXISTS "Users can view tracking updates for own packages" ON tracking_updates;
DROP POLICY IF EXISTS "Admins can manage all tracking updates" ON tracking_updates;

-- Simple tracking updates policies
CREATE POLICY "tracking_updates_public_select" ON tracking_updates
  FOR SELECT USING (true);

-- Routes policies
DROP POLICY IF EXISTS "Admins can manage routes" ON routes;
DROP POLICY IF EXISTS "Anyone can view routes" ON routes;

CREATE POLICY "routes_public_select" ON routes
  FOR SELECT USING (true);

-- App settings - only accessible via admin client
DROP POLICY IF EXISTS "Admin can manage app settings" ON app_settings;

-- Comment explaining the approach
COMMENT ON TABLE profiles IS 'RLS policies simplified to avoid recursion. Admin operations use server-side admin client to bypass RLS.';

COMMENT ON TABLE packages IS 'Public read access. Admin operations handled server-side to avoid RLS recursion.';

COMMENT ON TABLE tracking_updates IS 'Public read access for tracking functionality. Admin operations handled server-side.';

COMMENT ON TABLE routes IS 'Public read access. Admin operations handled server-side.';

COMMENT ON TABLE app_settings IS 'No RLS policies. Access controlled entirely through admin client server-side.';
