-- Index Creation Script
-- Creates additional indexes for performance optimization

USE shypram_catalogue;

-- Additional indexes for better query performance
CREATE INDEX idx_products_name_category ON products(name, category_id);
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
CREATE INDEX idx_contact_status_created ON contact_inquiries(status, created_at);
CREATE INDEX idx_analytics_type_created ON analytics_events(event_type, created_at);

-- Full-text search indexes
ALTER TABLE products ADD FULLTEXT(name, description);
ALTER TABLE contact_inquiries ADD FULLTEXT(subject, message);