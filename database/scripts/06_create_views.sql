-- Views Creation Script
-- Creates useful views for reporting and analytics

USE shypram_catalogue;

-- Product catalog view with category information
CREATE VIEW v_product_catalog AS
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

-- Order summary view
CREATE VIEW v_order_summary AS
SELECT 
    o.id,
    o.customer_name,
    o.customer_email,
    o.company_name,
    o.status,
    o.total_items,
    COUNT(oi.id) as item_count,
    o.created_at,
    o.updated_at
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- Category statistics view
CREATE VIEW v_category_stats AS
SELECT 
    c.id,
    c.name,
    COUNT(p.id) as product_count,
    COUNT(CASE WHEN p.is_active = TRUE THEN 1 END) as active_products
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;

-- Monthly order statistics
CREATE VIEW v_monthly_orders AS
SELECT 
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    COUNT(*) as order_count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
FROM orders
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;