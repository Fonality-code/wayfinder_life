-- Update packages table schema to match application needs
-- This script adds missing columns required by the application

-- Add missing columns to packages table
DO $$
BEGIN
    -- Add carrier column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='carrier') THEN
        ALTER TABLE packages ADD COLUMN carrier TEXT;
    END IF;

    -- Add recipient_email column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='recipient_email') THEN
        ALTER TABLE packages ADD COLUMN recipient_email TEXT;
    END IF;

    -- Add origin column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='origin') THEN
        ALTER TABLE packages ADD COLUMN origin TEXT;
    END IF;

    -- Add destination column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='destination') THEN
        ALTER TABLE packages ADD COLUMN destination TEXT;
    END IF;

    -- Add current_location column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='current_location') THEN
        ALTER TABLE packages ADD COLUMN current_location TEXT;
    END IF;

    -- Add estimated_delivery column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='estimated_delivery') THEN
        ALTER TABLE packages ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add dimensions column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='dimensions') THEN
        ALTER TABLE packages ADD COLUMN dimensions TEXT;
    END IF;

    -- Add notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='notes') THEN
        ALTER TABLE packages ADD COLUMN notes TEXT;
    END IF;

    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='user_id') THEN
        ALTER TABLE packages ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update status check constraint to include more statuses
ALTER TABLE packages DROP CONSTRAINT IF EXISTS packages_status_check;
ALTER TABLE packages ADD CONSTRAINT packages_status_check
    CHECK (status IN (
        'pending',
        'shipped',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'returned',
        'cancelled',
        'exception',
        'failed_delivery'
    ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_carrier ON packages(carrier);
CREATE INDEX IF NOT EXISTS idx_packages_recipient_email ON packages(recipient_email);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_estimated_delivery ON packages(estimated_delivery);

-- Update existing records to have sensible defaults
UPDATE packages SET
    carrier = 'Unknown' WHERE carrier IS NULL,
    origin = sender_address WHERE origin IS NULL AND sender_address IS NOT NULL,
    destination = recipient_address WHERE destination IS NULL AND recipient_address IS NOT NULL,
    recipient_email = '' WHERE recipient_email IS NULL;

-- Set NOT NULL constraints on important columns after setting defaults
ALTER TABLE packages ALTER COLUMN carrier SET DEFAULT 'Unknown';
ALTER TABLE packages ALTER COLUMN carrier SET NOT NULL;

COMMENT ON TABLE packages IS 'Updated schema to support modern package tracking features';
