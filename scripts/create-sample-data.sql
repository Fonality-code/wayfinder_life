-- Insert sample routes
INSERT INTO routes (name, origin, destination, estimated_duration_hours) VALUES
('Express Route NYC-LA', 'New York, NY', 'Los Angeles, CA', 72),
('Standard Route Chicago-Miami', 'Chicago, IL', 'Miami, FL', 48),
('International Route NYC-London', 'New York, NY', 'London, UK', 168),
('Local Route Boston-NYC', 'Boston, MA', 'New York, NY', 8)
ON CONFLICT DO NOTHING;

-- Insert sample packages
INSERT INTO packages (tracking_number, sender_name, sender_address, recipient_name, recipient_address, package_type, weight, status) VALUES
('TRK001234567', 'John Smith', '123 Main St, New York, NY 10001', 'Jane Doe', '456 Oak Ave, Los Angeles, CA 90210', 'Electronics', 2.5, 'in_transit'),
('TRK001234568', 'Alice Johnson', '789 Pine St, Chicago, IL 60601', 'Bob Wilson', '321 Beach Rd, Miami, FL 33101', 'Documents', 0.5, 'delivered'),
('TRK001234569', 'Carol Brown', '555 Elm St, Boston, MA 02101', 'David Lee', '777 Broadway, New York, NY 10003', 'Clothing', 1.2, 'pending'),
('TRK001234570', 'Emma Davis', '999 First Ave, Seattle, WA 98101', 'Frank Miller', '111 Second St, Portland, OR 97201', 'Books', 3.0, 'in_transit')
ON CONFLICT (tracking_number) DO NOTHING;

-- Insert sample tracking updates
WITH package_ids AS (
  SELECT id, tracking_number FROM packages WHERE tracking_number IN ('TRK001234567', 'TRK001234568', 'TRK001234570')
)
INSERT INTO tracking_updates (package_id, location, status, description, timestamp) 
SELECT 
  p.id,
  location,
  status,
  description,
  timestamp
FROM package_ids p
CROSS JOIN (
  VALUES 
    ('TRK001234567', 'New York Distribution Center', 'Package received', 'Package received at origin facility', NOW() - INTERVAL '2 days'),
    ('TRK001234567', 'Philadelphia Hub', 'In transit', 'Package in transit to next facility', NOW() - INTERVAL '1 day'),
    ('TRK001234567', 'Chicago Distribution Center', 'In transit', 'Package arrived at Chicago facility', NOW() - INTERVAL '12 hours'),
    
    ('TRK001234568', 'Chicago Distribution Center', 'Package received', 'Package received at origin facility', NOW() - INTERVAL '3 days'),
    ('TRK001234568', 'Atlanta Hub', 'In transit', 'Package in transit', NOW() - INTERVAL '2 days'),
    ('TRK001234568', 'Miami Distribution Center', 'Out for delivery', 'Package out for delivery', NOW() - INTERVAL '1 day'),
    ('TRK001234568', 'Miami Beach Rd', 'Delivered', 'Package delivered successfully', NOW() - INTERVAL '6 hours'),
    
    ('TRK001234570', 'Seattle Distribution Center', 'Package received', 'Package received at origin facility', NOW() - INTERVAL '1 day'),
    ('TRK001234570', 'Portland Hub', 'In transit', 'Package in transit to destination', NOW() - INTERVAL '6 hours')
) AS updates(pkg_tracking, location, status, description, timestamp)
WHERE p.tracking_number = updates.pkg_tracking;
