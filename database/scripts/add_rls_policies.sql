-- Add RLS policies for unrestricted tables
-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public read access" ON categories;
    DROP POLICY IF EXISTS "Admin write access categories" ON categories;
    DROP POLICY IF EXISTS "Public read access" ON products;
    DROP POLICY IF EXISTS "Admin write access products" ON products;
    DROP POLICY IF EXISTS "Admin access only" ON order_items;
    DROP POLICY IF EXISTS "Admin access only" ON analytics_events;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS for unrestricted tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Categories policies (read-only for public)
CREATE POLICY "Public read access" ON categories
FOR SELECT USING (true);

CREATE POLICY "Admin write access categories" ON categories
FOR ALL USING (auth.role() = 'authenticated');

-- Products policies (read-only for public)
CREATE POLICY "Public read access" ON products
FOR SELECT USING (true);

CREATE POLICY "Admin write access products" ON products
FOR ALL USING (auth.role() = 'authenticated');

-- Order items policies (admin only)
CREATE POLICY "Admin access only" ON order_items
FOR ALL USING (auth.role() = 'authenticated');

-- Analytics events policies (admin only)
CREATE POLICY "Admin access only" ON analytics_events
FOR ALL USING (auth.role() = 'authenticated');