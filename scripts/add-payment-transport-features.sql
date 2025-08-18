-- Add payment and transport features to packages table
-- This script adds payment tracking and transport type selection

DO $$
BEGIN
    -- Add transport_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='transport_type') THEN
        ALTER TABLE packages ADD COLUMN transport_type TEXT CHECK (transport_type IN ('air', 'ship', 'truck', 'rail', 'local'));
    END IF;

    -- Add payment_method column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='payment_method') THEN
        ALTER TABLE packages ADD COLUMN payment_method TEXT CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash', 'check', 'cod', 'prepaid'));
    END IF;

    -- Add payment_amount column (amount paid by customer)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='payment_amount') THEN
        ALTER TABLE packages ADD COLUMN payment_amount DECIMAL(10,2);
    END IF;

    -- Add payment_currency column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='payment_currency') THEN
        ALTER TABLE packages ADD COLUMN payment_currency TEXT DEFAULT 'USD';
    END IF;

    -- Add payment_status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='payment_status') THEN
        ALTER TABLE packages ADD COLUMN payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded', 'cancelled')) DEFAULT 'pending';
    END IF;

    -- Add payment_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='payment_date') THEN
        ALTER TABLE packages ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add shipping_cost column (total shipping cost)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='shipping_cost') THEN
        ALTER TABLE packages ADD COLUMN shipping_cost DECIMAL(10,2);
    END IF;

    -- Add total_cost column (shipping + handling + insurance, etc.)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='total_cost') THEN
        ALTER TABLE packages ADD COLUMN total_cost DECIMAL(10,2);
    END IF;

    -- Add insurance_cost column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='insurance_cost') THEN
        ALTER TABLE packages ADD COLUMN insurance_cost DECIMAL(10,2) DEFAULT 0.00;
    END IF;

    -- Add handling_fee column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='handling_fee') THEN
        ALTER TABLE packages ADD COLUMN handling_fee DECIMAL(10,2) DEFAULT 0.00;
    END IF;

    -- Add expected_delivery_time column (estimated hours for transport type)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='expected_delivery_time') THEN
        ALTER TABLE packages ADD COLUMN expected_delivery_time INTEGER; -- hours
    END IF;

END $$;

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_packages_transport_type ON packages(transport_type);
CREATE INDEX IF NOT EXISTS idx_packages_payment_method ON packages(payment_method);
CREATE INDEX IF NOT EXISTS idx_packages_payment_status ON packages(payment_status);
CREATE INDEX IF NOT EXISTS idx_packages_payment_date ON packages(payment_date);

-- Set default values for transport_type based on carrier (educated guess)
UPDATE packages SET transport_type = CASE
    WHEN carrier ILIKE '%air%' OR carrier ILIKE '%express%' THEN 'air'
    WHEN carrier ILIKE '%ground%' OR carrier ILIKE '%truck%' THEN 'truck'
    WHEN carrier ILIKE '%ocean%' OR carrier ILIKE '%sea%' THEN 'ship'
    ELSE 'truck' -- default to truck for most ground carriers
END WHERE transport_type IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN packages.transport_type IS 'Method of transportation: air, ship, truck, rail, or local';
COMMENT ON COLUMN packages.payment_method IS 'Payment method used by customer';
COMMENT ON COLUMN packages.payment_amount IS 'Amount paid by customer in the specified currency';
COMMENT ON COLUMN packages.payment_currency IS 'Currency of payment (default: USD)';
COMMENT ON COLUMN packages.payment_status IS 'Status of payment: pending, paid, partial, refunded, cancelled';
COMMENT ON COLUMN packages.payment_date IS 'Date when payment was completed';
COMMENT ON COLUMN packages.shipping_cost IS 'Base shipping cost';
COMMENT ON COLUMN packages.total_cost IS 'Total cost including shipping, handling, insurance';
COMMENT ON COLUMN packages.insurance_cost IS 'Cost of package insurance';
COMMENT ON COLUMN packages.handling_fee IS 'Additional handling fees';
COMMENT ON COLUMN packages.expected_delivery_time IS 'Expected delivery time in hours based on transport type';
