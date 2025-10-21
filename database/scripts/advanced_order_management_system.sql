-- =============================================
-- ADVANCED ORDER MANAGEMENT SYSTEM - SUPABASE
-- Real-time data only - No mock data
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS system_alerts CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS cancelled_orders CASCADE;
DROP TABLE IF EXISTS delivered_orders CASCADE;
DROP TABLE IF EXISTS shipped_orders CASCADE;
DROP TABLE IF EXISTS confirmed_orders CASCADE;
DROP TABLE IF EXISTS processing_orders CASCADE;
DROP TABLE IF EXISTS pending_orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
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
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    packaging_details JSONB,
    cutting_quantity DECIMAL(10,2),
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE confirmed_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipped_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100),
    carrier VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivered_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cancelled_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES admin_users(id),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
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

CREATE TABLE admin_notifications (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admin_users(id),
    notification_type VARCHAR(50) NOT NULL,
    recipient VARCHAR(200) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    sent_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    order_id INTEGER REFERENCES orders(id),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    admin_id INTEGER REFERENCES admin_users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time API Functions
CREATE OR REPLACE FUNCTION create_order(
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    order_items_json JSONB,
    packaging_option VARCHAR(20) DEFAULT 'plain',
    final_packaging VARCHAR(20) DEFAULT 'box',
    packaging_details_param JSONB DEFAULT NULL,
    cutting_quantity_param DECIMAL(10,2) DEFAULT NULL,
    notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    order_id INTEGER,
    order_number VARCHAR(50),
    message TEXT
) AS $$
DECLARE
    new_order_id INTEGER;
    new_order_number VARCHAR(50);
    item JSONB;
    total_amount DECIMAL(10,2) := 0;
BEGIN
    new_order_number := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('orders_id_seq')::TEXT, 4, '0');
    
    FOR item IN SELECT * FROM jsonb_array_elements(order_items_json)
    LOOP
        total_amount := total_amount + (item->>'quantity')::INTEGER * (item->>'unit_price')::DECIMAL(10,2);
    END LOOP;
    
    INSERT INTO orders (
        order_number, customer_info, items, total_amount, 
        packaging_option, final_packaging, packaging_details, cutting_quantity, notes
    ) VALUES (
        new_order_number,
        jsonb_build_object(
            'name', customer_name,
            'email', customer_email,
            'phone', customer_phone,
            'address', customer_address
        ),
        order_items_json,
        total_amount,
        packaging_option,
        final_packaging,
        packaging_details_param,
        cutting_quantity_param,
        notes
    ) RETURNING id INTO new_order_id;
    
    FOR item IN SELECT * FROM jsonb_array_elements(order_items_json)
    LOOP
        INSERT INTO order_items (
            order_id, product_id, quantity, unit_price, total_price
        ) VALUES (
            new_order_id,
            (item->>'product_id')::INTEGER,
            (item->>'quantity')::INTEGER,
            (item->>'unit_price')::DECIMAL(10,2),
            (item->>'quantity')::INTEGER * (item->>'unit_price')::DECIMAL(10,2)
        );
    END LOOP;
    
    RETURN QUERY SELECT TRUE, new_order_id, new_order_number, 'Order placed successfully'::TEXT;
    
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, NULL::INTEGER, NULL::VARCHAR(50), SQLERRM::TEXT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION send_sms_new_order(order_id_param INTEGER)
RETURNS VOID AS $$
DECLARE
    order_record RECORD;
    admin_record RECORD;
    sms_message TEXT;
BEGIN
    SELECT * INTO order_record FROM orders WHERE id = order_id_param;
    
    sms_message := '🚨 NEW ORDER #' || order_record.order_number || 
        ' from ' || (order_record.customer_info->>'name') || 
        '. Total: $' || order_record.total_amount || 
        '. Process immediately!';
    
    FOR admin_record IN SELECT * FROM admin_users WHERE is_active = TRUE AND phone IS NOT NULL LOOP
        INSERT INTO admin_notifications (
            admin_id, notification_type, recipient, subject, message, order_id
        ) VALUES (
            admin_record.id,
            'sms',
            admin_record.phone,
            'New Order Alert',
            sms_message,
            order_id_param
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION send_email_status_update(order_id_param INTEGER, old_status_param VARCHAR(20), new_status_param VARCHAR(20))
RETURNS VOID AS $$
DECLARE
    order_record RECORD;
    customer_email VARCHAR(100);
    email_subject TEXT;
    email_message TEXT;
BEGIN
    SELECT * INTO order_record FROM orders WHERE id = order_id_param;
    customer_email := order_record.customer_info->>'email';
    
    email_subject := 'Order Status Update - Order #' || order_record.order_number;
    
    email_message := '<h2>Order Status Update</h2>' ||
        '<p>Dear ' || (order_record.customer_info->>'name') || ',</p>' ||
        '<p>Your order status has been updated:</p>' ||
        '<p><strong>Order #:</strong> ' || order_record.order_number || '</p>' ||
        '<p><strong>Previous Status:</strong> ' || UPPER(old_status_param) || '</p>' ||
        '<p><strong>Current Status:</strong> ' || UPPER(new_status_param) || '</p>' ||
        '<p><strong>Order Total:</strong> $' || order_record.total_amount || '</p>';
    
    IF new_status_param = 'processing' THEN
        email_message := email_message || '<p>✅ Your order is now being processed by our team.</p>';
    ELSIF new_status_param = 'confirmed' THEN
        email_message := email_message || '<p>✅ Your order has been confirmed and will be shipped soon.</p>';
    ELSIF new_status_param = 'shipped' THEN
        email_message := email_message || '<p>🚚 Your order has been shipped and is on its way!</p>';
    ELSIF new_status_param = 'delivered' THEN
        email_message := email_message || '<p>📦 Your order has been delivered successfully!</p>';
    ELSIF new_status_param = 'cancelled' THEN
        email_message := email_message || '<p>❌ Your order has been cancelled. Please contact us for more information.</p>';
    END IF;
    
    email_message := email_message || 
        '<p>Thank you for choosing Shypram!</p>' ||
        '<p>Best regards,<br>Shypram Team</p>';
    
    INSERT INTO admin_notifications (
        admin_id, notification_type, recipient, subject, message, order_id
    ) VALUES (
        1,
        'email',
        customer_email,
        email_subject,
        email_message,
        order_id_param
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_new_order()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO pending_orders (order_id) VALUES (NEW.id);
    
    INSERT INTO system_alerts (
        alert_type, message, severity, order_id
    ) VALUES (
        'new_order',
        'New order #' || NEW.order_number || ' received from ' || (NEW.customer_info->>'name'),
        'info',
        NEW.id
    );
    
    PERFORM send_sms_new_order(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_at)
    VALUES (NEW.id, OLD.status, NEW.status, NOW());
    
    IF OLD.status IS NOT NULL AND OLD.status != NEW.status THEN
        PERFORM send_email_status_update(NEW.id, OLD.status, NEW.status);
    END IF;
    
    IF NEW.status = 'processing' AND OLD.status = 'pending' THEN
        DELETE FROM pending_orders WHERE order_id = NEW.id;
        INSERT INTO processing_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'confirmed' AND OLD.status = 'processing' THEN
        DELETE FROM processing_orders WHERE order_id = NEW.id;
        INSERT INTO confirmed_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'shipped' AND OLD.status = 'confirmed' THEN
        DELETE FROM confirmed_orders WHERE order_id = NEW.id;
        INSERT INTO shipped_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'delivered' AND OLD.status = 'shipped' THEN
        DELETE FROM shipped_orders WHERE order_id = NEW.id;
        INSERT INTO delivered_orders (order_id) VALUES (NEW.id);
    ELSIF NEW.status = 'cancelled' THEN
        INSERT INTO cancelled_orders (order_id, cancellation_reason) 
        VALUES (NEW.id, 'Order cancelled');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_admin_dashboard()
RETURNS TABLE(
    total_orders BIGINT,
    pending_count BIGINT,
    processing_count BIGINT,
    confirmed_count BIGINT,
    shipped_count BIGINT,
    delivered_count BIGINT,
    cancelled_count BIGINT,
    today_orders BIGINT,
    today_revenue DECIMAL(12,2),
    unread_notifications BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'processing') as processing_count,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
        COUNT(*) FILTER (WHERE status = 'shipped') as shipped_count,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered_count,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
        COUNT(*) FILTER (WHERE DATE(order_date) = CURRENT_DATE) as today_orders,
        COALESCE(SUM(total_amount) FILTER (WHERE DATE(order_date) = CURRENT_DATE), 0) as today_revenue,
        (SELECT COUNT(*) FROM admin_notifications WHERE is_read = FALSE) as unread_notifications
    FROM orders
    WHERE is_deleted = FALSE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_orders()
RETURNS TABLE(
    id INTEGER,
    order_number VARCHAR(50),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    order_date TIMESTAMPTZ,
    packaging_option VARCHAR(20),
    final_packaging VARCHAR(20),
    item_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.order_number,
        o.customer_info->>'name' as customer_name,
        o.customer_info->>'email' as customer_email,
        o.customer_info->>'phone' as customer_phone,
        o.total_amount,
        o.status,
        o.order_date,
        o.packaging_option,
        o.final_packaging,
        COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.is_deleted = FALSE
    GROUP BY o.id, o.order_number, o.customer_info, o.total_amount, o.status, o.order_date, o.packaging_option, o.final_packaging
    ORDER BY o.order_date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_order_status(order_id_param INTEGER, new_status_param VARCHAR(20))
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
BEGIN
    UPDATE orders 
    SET status = new_status_param, updated_at = NOW()
    WHERE id = order_id_param;
    
    IF FOUND THEN
        RETURN QUERY SELECT TRUE, 'Order status updated successfully'::TEXT;
    ELSE
        RETURN QUERY SELECT FALSE, 'Order not found'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_new_order
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION process_new_order();

CREATE TRIGGER trigger_order_status_change
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_order_status_change();

-- Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_pending_orders_created ON pending_orders(created_at);
CREATE INDEX idx_admin_notifications_read ON admin_notifications(is_read);

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Public policies for UI
CREATE POLICY "Allow public order creation" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public order viewing" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Allow public order item creation" ON order_items
    FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admin full access" ON admin_users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin order management" ON orders
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin notification access" ON admin_notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- Views for real-time data
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.customer_info->>'name' as customer_name,
    o.customer_info->>'email' as customer_email,
    o.customer_info->>'phone' as customer_phone,
    o.total_amount,
    o.status,
    o.order_date,
    o.packaging_option,
    o.final_packaging,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.is_deleted = FALSE
GROUP BY o.id, o.order_number, o.customer_info, o.total_amount, o.status, o.order_date, o.packaging_option, o.final_packaging;

-- Add missing columns if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cutting_quantity DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS packaging_details JSONB;

-- Only create admin user (no sample data)
INSERT INTO admin_users (username, email, phone, password_hash, role) 
VALUES (
    'admin', 
    'admin@shypram.com', 
    '+1234567890',
    crypt('admin123', gen_salt('bf')), 
    'admin'
)
ON CONFLICT (username) DO NOTHING;