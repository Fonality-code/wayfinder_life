-- Add route_id column to packages table to link packages with routes
DO $$
BEGIN
    -- Add route_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='route_id') THEN
        ALTER TABLE packages ADD COLUMN route_id UUID REFERENCES routes(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added route_id column to packages table';
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_packages_route_id ON packages(route_id);

-- Add some sample route assignments (optional, for existing packages)
-- You can comment this out if you don't want sample data
COMMENT ON COLUMN packages.route_id IS 'Foreign key reference to routes table for package route visualization';
