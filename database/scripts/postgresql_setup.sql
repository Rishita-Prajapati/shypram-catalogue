-- =============================================
-- SHYPRAM RUBBER CATALOGUE - POSTGRESQL SETUP
-- =============================================

-- =============================================
-- 1. TABLES
-- =============================================

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
    name VARCHAR(255) NOT NULL,
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
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    company_name VARCHAR(100),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    total_items INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
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
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);

-- =============================================
-- 3. CATEGORY DATA
-- =============================================

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

-- =============================================
-- 4. ADMIN USER
-- =============================================

INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@shypramrubber.com', '$2b$10$rOvHPxfzMtkgFqBhlaQeP.jrQGmzrQGmzrQGmzrQGmzrQGmzrQGmzr', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- 5. VIEWS
-- =============================================

CREATE OR REPLACE VIEW v_product_catalog AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.image_url,
    p.specifications,
    p.is_active,
    c.name as category_name,
    c.description as category_description,
    p.created_at,
    p.updated_at
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- =============================================
-- 6. FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- 7. TRIGGERS
-- =============================================

-- Update triggers for updated_at columns
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 8. SAMPLE DATA
-- =============================================

INSERT INTO products (name, description, category_id, image_url, specifications) VALUES
('Industrial Rubber Sheet - Black', 'High-quality black rubber sheet for industrial applications', 1, '/images/products/rubber-sheet-black.jpg', '{"thickness": "3mm", "hardness": "60 Shore A", "material": "NBR"}'),
('Food Grade Rubber Sheet', 'FDA approved rubber sheet for food industry', 1, '/images/products/rubber-sheet-food.jpg', '{"thickness": "5mm", "hardness": "70 Shore A", "material": "Silicone"}'),
('Safety Rubber Mat', 'Non-slip safety mat for industrial floors', 2, '/images/products/safety-mat.jpg', '{"size": "1m x 1m", "thickness": "10mm", "pattern": "Diamond"}'),
('O-Ring Gasket Set', 'Standard O-ring gaskets in various sizes', 3, '/images/products/o-ring-set.jpg', '{"material": "Viton", "temperature_range": "-20°C to 200°C", "sizes": "Multiple"}')
ON CONFLICT DO NOTHING;