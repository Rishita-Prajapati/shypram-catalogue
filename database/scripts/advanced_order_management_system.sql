-- =============================================
-- ADVANCED ORDER MANAGEMENT SYSTEM - SUPABASE
-- Complete schema with automation and analytics
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Drop existing tables in correct order
DROP TABLE IF EXISTS system_alerts CASCADE;
DROP TABLE IF EXISTS email_notifications CASCADE;
DROP TABLE IF EXISTS product_analytics CASCADE;
DROP TABLE IF EXISTS customer_analytics CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS monthly_reports CASCADE;
DROP TABLE IF EXISTS contact_queries CASCADE;
DROP TABLE IF EXISTS cancelled_orders CASCADE;
DROP TABLE IF EXISTS delivered_orders CASCADE;
DROP TABLE IF EXISTS shipped_orders CASCADE;
DROP TABLE IF EXISTS confirmed_orders CASCADE;
DROP TABLE IF EXISTS processing_orders CASCADE;
DROP TABLE IF EXISTS pending_orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS contact_inquiries CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Core Tables
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    image_url VARCHAR(255),
    specifications JSONB,
    price DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_info JSONB NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    packaging_option VARCHAR(20) DEFAULT 'plain',
    final_packaging VARCHAR(20) DEFAULT 'box',
    order_date TIMESTAMPTZ DEFAULT NOW(),
    estimated_delivery TIMESTAMPTZ,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Status Tables
CREATE TABLE pending_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    alert_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE processing_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES admin_users(id),
    processing_started_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE confirmed_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES admin_users(id),
    confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipped_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100),
    carrier VARCHAR(50),
    shipped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivered_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivered_at TIMESTAMPTZ DEFAULT NOW(),
    delivery_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cancelled_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES admin_users(id),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact System
CREATE TABLE contact_queries (
    query_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    admin_id INTEGER REFERENCES admin_users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    ip_address INET,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Tables
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    admin_id INTEGER REFERENCES admin_users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

CREATE TABLE customer_analytics (
    id SERIAL PRIMARY KEY,
    customer_email VARCHAR(100) NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    most_purchased_category_id INTEGER REFERENCES categories(id),
    last_order_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_analytics (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    total_orders INTEGER DEFAULT 0,
    total_quantity_sold INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    return_count INTEGER DEFAULT 0,
    last_sold_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE monthly_reports (
    report_id SERIAL PRIMARY KEY,
    report_month DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    most_sold_product_id INTEGER REFERENCES products(id),
    least_sold_product_id INTEGER REFERENCES products(id),
    average_processing_time INTERVAL,
    generated_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_notifications (
    id SERIAL PRIMARY KEY,
    recipient_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    sent_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    order_id INTEGER REFERENCES orders(id),
    admin_id INTEGER REFERENCES admin_users(id),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders USING GIN (customer_info);
CREATE INDEX idx_pending_orders_created ON pending_orders(created_at);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_contact_queries_status ON contact_queries(status);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);

-- Functions
CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_status_history (order_id, old_status, new_status, admin_id, notes)
    VALUES (NEW.id, OLD.status, NEW.status, 
            COALESCE((current_setting('app.current_admin_id', true))::INTEGER, NULL),
            'Status changed from ' || OLD.status || ' to ' || NEW.status);

    IF OLD.status = 'pending' THEN DELETE FROM pending_orders WHERE order_id = NEW.id;
    ELSIF OLD.status = 'processing' THEN DELETE FROM processing_orders WHERE order_id = NEW.id;
    ELSIF OLD.status = 'confirmed' THEN DELETE FROM confirmed_orders WHERE order_id = NEW.id;
    ELSIF OLD.status = 'shipped' THEN DELETE FROM shipped_orders WHERE order_id = NEW.id;
    ELSIF OLD.status = 'delivered' THEN DELETE FROM delivered_orders WHERE order_id = NEW.id;
    ELSIF OLD.status = 'cancelled' THEN DELETE FROM cancelled_orders WHERE order_id = NEW.id;
    END IF;

    IF NEW.status = 'pending' THEN INSERT INTO pending_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'processing' THEN INSERT INTO processing_orders (order_id, admin_id) VALUES (NEW.id, COALESCE((current_setting('app.current_admin_id', true))::INTEGER, NULL));
    ELSIF NEW.status = 'confirmed' THEN INSERT INTO confirmed_orders (order_id, admin_id) VALUES (NEW.id, COALESCE((current_setting('app.current_admin_id', true))::INTEGER, NULL));
    ELSIF NEW.status = 'shipped' THEN INSERT INTO shipped_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'delivered' THEN INSERT INTO delivered_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'cancelled' THEN INSERT INTO cancelled_orders (order_id, admin_id, cancellation_reason) VALUES (NEW.id, COALESCE((current_setting('app.current_admin_id', true))::INTEGER, NULL), 'Order cancelled');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_pending_orders_alert()
RETURNS void AS $$
DECLARE
    pending_order RECORD;
BEGIN
    FOR pending_order IN 
        SELECT p.order_id, o.order_number, o.customer_info
        FROM pending_orders p
        JOIN orders o ON p.order_id = o.id
        WHERE p.created_at < NOW() - INTERVAL '3 hours'
        AND p.alert_sent = FALSE
    LOOP
        INSERT INTO email_notifications (
            recipient_email, subject, message, notification_type, order_id
        ) VALUES (
            'admin@shypramrubber.com',
            'Pending Order Alert - Order #' || pending_order.order_number,
            'Order #' || pending_order.order_number || ' has been pending for more than 3 hours. Customer: ' || (pending_order.customer_info->>'name'),
            'pending_alert',
            pending_order.order_id
        );
        UPDATE pending_orders SET alert_sent = TRUE WHERE order_id = pending_order.order_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_monthly_report()
RETURNS void AS $$
DECLARE
    report_date DATE := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
    total_orders_count INTEGER;
    total_revenue_amount DECIMAL(12,2);
    most_sold_product INTEGER;
    least_sold_product INTEGER;
    avg_processing_time INTERVAL;
BEGIN
    SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
    INTO total_orders_count, total_revenue_amount
    FROM orders WHERE DATE_TRUNC('month', order_date) = report_date;

    SELECT product_id INTO most_sold_product
    FROM order_items oi JOIN orders o ON oi.order_id = o.id
    WHERE DATE_TRUNC('month', o.order_date) = report_date
    GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 1;

    SELECT product_id INTO least_sold_product
    FROM order_items oi JOIN orders o ON oi.order_id = o.id
    WHERE DATE_TRUNC('month', o.order_date) = report_date
    GROUP BY product_id ORDER BY SUM(quantity) ASC LIMIT 1;

    SELECT AVG(delivered.delivered_at - o.order_date) INTO avg_processing_time
    FROM orders o JOIN delivered_orders delivered ON o.id = delivered.order_id
    WHERE DATE_TRUNC('month', o.order_date) = report_date;

    INSERT INTO monthly_reports (
        report_month, total_orders, total_revenue, 
        most_sold_product_id, least_sold_product_id, 
        average_processing_time, generated_by
    ) VALUES (
        report_date, total_orders_count, total_revenue_amount,
        most_sold_product, least_sold_product, avg_processing_time, 1
    );
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER order_status_change_trigger
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_order_status_change();

CREATE TRIGGER new_order_trigger
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION handle_order_status_change();

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmed_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipped_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivered_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancelled_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true AND is_deleted = false);
CREATE POLICY "Admin full access admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access pending_orders" ON pending_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access processing_orders" ON processing_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access confirmed_orders" ON confirmed_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access shipped_orders" ON shipped_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access delivered_orders" ON delivered_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access cancelled_orders" ON cancelled_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_queries" ON contact_queries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert contact_queries" ON contact_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access contact_inquiries" ON contact_inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read analytics_events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read order_status_history" ON order_status_history FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read customer_analytics" ON customer_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read product_analytics" ON product_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read monthly_reports" ON monthly_reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read email_notifications" ON email_notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access system_alerts" ON system_alerts FOR ALL USING (auth.role() = 'authenticated');

-- Sample Data
INSERT INTO categories (name, description, image_url) VALUES
('Rubber Sheets', 'High-quality rubber sheets for various industrial applications', '/images/categories/rubber-sheets.jpg'),
('Rubber Mats', 'Durable rubber mats for flooring and safety applications', '/images/categories/rubber-mats.jpg'),
('Rubber Gaskets', 'Precision rubber gaskets for sealing applications', '/images/categories/rubber-gaskets.jpg'),
('Rubber Hoses', 'Flexible rubber hoses for fluid transfer systems', '/images/categories/rubber-hoses.jpg'),
('Rubber Seals', 'Industrial rubber seals for various machinery', '/images/categories/rubber-seals.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@shypramrubber.com', crypt('TempAdmin123!', gen_salt('bf', 12)), 'super_admin')
ON CONFLICT (username) DO NOTHING;