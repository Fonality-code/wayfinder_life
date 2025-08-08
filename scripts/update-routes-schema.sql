-- Add geolocation columns to routes table
ALTER TABLE routes ADD COLUMN IF NOT EXISTS origin_lat DECIMAL(10, 8);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS origin_lng DECIMAL(11, 8);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS destination_lat DECIMAL(10, 8);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS destination_lng DECIMAL(11, 8);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS waypoints JSONB;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

-- Add geolocation to tracking updates
ALTER TABLE tracking_updates ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE tracking_updates ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Update sample routes with coordinates
UPDATE routes SET 
  origin_lat = 40.7128, origin_lng = -74.0060,
  destination_lat = 34.0522, destination_lng = -118.2437,
  color = '#EF4444'
WHERE name = 'Express Route NYC-LA';

UPDATE routes SET 
  origin_lat = 41.8781, origin_lng = -87.6298,
  destination_lat = 25.7617, destination_lng = -80.1918,
  color = '#10B981'
WHERE name = 'Standard Route Chicago-Miami';

UPDATE routes SET 
  origin_lat = 40.7128, origin_lng = -74.0060,
  destination_lat = 51.5074, destination_lng = -0.1278,
  color = '#8B5CF6'
WHERE name = 'International Route NYC-London';

UPDATE routes SET 
  origin_lat = 42.3601, origin_lng = -71.0589,
  destination_lat = 40.7128, destination_lng = -74.0060,
  color = '#F59E0B'
WHERE name = 'Local Route Boston-NYC';
