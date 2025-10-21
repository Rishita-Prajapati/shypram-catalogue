-- Add packaging_details to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS packaging_details JSONB;

-- Enable RLS for unrestricted tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);

-- Products policies
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

-- Order items policies
CREATE POLICY "Admin access only" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Analytics events policies
CREATE POLICY "Admin access only" ON analytics_events FOR ALL USING (auth.role() = 'authenticated');