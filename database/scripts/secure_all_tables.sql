-- =============================================
-- SECURE ALL TABLES - ROW LEVEL SECURITY
-- Apply RLS to all tables in the system
-- =============================================

-- Enable RLS on all tables
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

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin full access admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Admin full access order_items" ON order_items;
DROP POLICY IF EXISTS "Admin full access pending_orders" ON pending_orders;
DROP POLICY IF EXISTS "Admin full access processing_orders" ON processing_orders;
DROP POLICY IF EXISTS "Admin full access confirmed_orders" ON confirmed_orders;
DROP POLICY IF EXISTS "Admin full access shipped_orders" ON shipped_orders;
DROP POLICY IF EXISTS "Admin full access delivered_orders" ON delivered_orders;
DROP POLICY IF EXISTS "Admin full access cancelled_orders" ON cancelled_orders;
DROP POLICY IF EXISTS "Admin full access contact_queries" ON contact_queries;
DROP POLICY IF EXISTS "Public insert contact_queries" ON contact_queries;
DROP POLICY IF EXISTS "Admin full access contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Public insert contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin read analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Admin read order_status_history" ON order_status_history;
DROP POLICY IF EXISTS "Admin read customer_analytics" ON customer_analytics;
DROP POLICY IF EXISTS "Admin read product_analytics" ON product_analytics;
DROP POLICY IF EXISTS "Admin read monthly_reports" ON monthly_reports;
DROP POLICY IF EXISTS "Admin read email_notifications" ON email_notifications;
DROP POLICY IF EXISTS "Admin full access system_alerts" ON system_alerts;

-- Categories policies
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Products policies
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true AND is_deleted = false);

-- Admin users policies (admin only)
CREATE POLICY "Admin full access admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Order items policies (admin only)
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Order status tables policies (admin only)
CREATE POLICY "Admin full access pending_orders" ON pending_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access processing_orders" ON processing_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access confirmed_orders" ON confirmed_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access shipped_orders" ON shipped_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access delivered_orders" ON delivered_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access cancelled_orders" ON cancelled_orders FOR ALL USING (auth.role() = 'authenticated');

-- Contact queries policies
CREATE POLICY "Admin full access contact_queries" ON contact_queries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert contact_queries" ON contact_queries FOR INSERT WITH CHECK (true);

-- Contact inquiries policies
CREATE POLICY "Admin full access contact_inquiries" ON contact_inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Analytics tables policies (admin read only)
CREATE POLICY "Admin read analytics_events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read order_status_history" ON order_status_history FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read customer_analytics" ON customer_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read product_analytics" ON product_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read monthly_reports" ON monthly_reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read email_notifications" ON email_notifications FOR SELECT USING (auth.role() = 'authenticated');

-- System alerts policies (admin only)
CREATE POLICY "Admin full access system_alerts" ON system_alerts FOR ALL USING (auth.role() = 'authenticated');