-- =============================================
-- SHYPRAM RUBBER CATALOGUE - POSTGRESQL SETUP
-- SECURE DATABASE SCHEMA WITH PROPER VALIDATIONS
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Force drop orders table if it exists with wrong structure
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    image_url VARCHAR(255),
    specifications JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_info JSONB NOT NULL,
    items JSONB NOT NULL,
    packaging_option VARCHAR(20) DEFAULT 'plain',
    final_packaging VARCHAR(20) DEFAULT 'box',
    packaging_details JSONB,
    total_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    order_date TIMESTAMPTZ DEFAULT NOW(),
    estimated_delivery TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- Category data
INSERT INTO categories (name, description, image_url) VALUES
('Rubber Sheets', 'High-quality rubber sheets for various industrial applications', '/images/categories/rubber-sheets.jpg'),
('Rubber Mats', 'Durable rubber mats for flooring and safety applications', '/images/categories/rubber-mats.jpg'),
('Rubber Gaskets', 'Precision rubber gaskets for sealing applications', '/images/categories/rubber-gaskets.jpg'),
('Rubber Hoses', 'Flexible rubber hoses for fluid transfer systems', '/images/categories/rubber-hoses.jpg'),
('Rubber Seals', 'Industrial rubber seals for various machinery', '/images/categories/rubber-seals.jpg'),
('Rubber Rollers', 'Custom rubber rollers for printing and manufacturing', '/images/categories/rubber-rollers.jpg'),
('Rubber Profiles', 'Extruded rubber profiles for construction and automotive', '/images/categories/rubber-profiles.jpg'),
('Custom Products', 'Bespoke rubber products manufactured to specifications', '/images/categories/custom-products.jpg')
ON CONFLICT (name) DO NOTHING;

-- Create admin user
INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@shypramrubber.com', crypt('TempAdmin123!', gen_salt('bf', 12)), 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Sample products
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE name = 'Rubber Sheets') AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Industrial Rubber Sheet - Black') THEN
        INSERT INTO products (name, description, category_id, image_url, specifications) 
        SELECT 'Industrial Rubber Sheet - Black', 'High-quality black rubber sheet for industrial applications', c.id, '/images/products/rubber-sheet-black.jpg', '{"thickness": "3mm", "hardness": "60 Shore A", "material": "NBR"}'
        FROM categories c WHERE c.name = 'Rubber Sheets';
    END IF;
    
    IF EXISTS (SELECT 1 FROM categories WHERE name = 'Rubber Mats') AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Safety Rubber Mat') THEN
        INSERT INTO products (name, description, category_id, image_url, specifications)
        SELECT 'Safety Rubber Mat', 'Non-slip safety mat for industrial floors', c.id, '/images/products/safety-mat.jpg', '{"size": "1m x 1m", "thickness": "10mm", "pattern": "Diamond"}'
        FROM categories c WHERE c.name = 'Rubber Mats';
    END IF;
    
    IF EXISTS (SELECT 1 FROM categories WHERE name = 'Rubber Gaskets') AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'O-Ring Gasket Set') THEN
        INSERT INTO products (name, description, category_id, image_url, specifications)
        SELECT 'O-Ring Gasket Set', 'Standard O-ring gaskets in various sizes', c.id, '/images/products/o-ring-set.jpg', '{"material": "Viton", "temperature_range": "-20°C to 200°C", "sizes": "Multiple"}'
        FROM categories c WHERE c.name = 'Rubber Gaskets';
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Allow anonymous read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON orders FOR INSERT WITH CHECK (true);

-- Admin-only access for sensitive tables
CREATE POLICY "Admin access only" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access only" ON analytics_events FOR ALL USING (auth.role() = 'authenticated');

-- Contact inquiries policies
CREATE POLICY "Allow anonymous insert" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read access" ON contact_inquiries FOR SELECT USING (auth.role() = 'authenticated');