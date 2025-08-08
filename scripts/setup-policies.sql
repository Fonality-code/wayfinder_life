-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all packages" ON packages;
DROP POLICY IF EXISTS "Admins can insert packages" ON packages;
DROP POLICY IF EXISTS "Admins can update packages" ON packages;
DROP POLICY IF EXISTS "Anyone can view packages for tracking" ON packages;
DROP POLICY IF EXISTS "Anyone can view tracking updates" ON tracking_updates;
DROP POLICY IF EXISTS "Admins can manage routes" ON routes;
DROP POLICY IF EXISTS "Anyone can view routes" ON routes;
DROP POLICY IF EXISTS "Admins can manage tracking updates" ON tracking_updates;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admin policies
CREATE POLICY "Admins can view all packages" ON packages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can insert packages" ON packages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can update packages" ON packages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- User policies for tracking
CREATE POLICY "Anyone can view packages for tracking" ON packages FOR SELECT USING (true);
CREATE POLICY "Anyone can view tracking updates" ON tracking_updates FOR SELECT USING (true);

-- Route policies
CREATE POLICY "Admins can manage routes" ON routes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Anyone can view routes" ON routes FOR SELECT USING (true);

-- Tracking updates policies
CREATE POLICY "Admins can manage tracking updates" ON tracking_updates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
