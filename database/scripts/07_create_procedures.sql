-- Stored Procedures Script
-- Creates useful stored procedures for common operations

USE shypram_catalogue;

DELIMITER //

-- Procedure to get products by category
CREATE PROCEDURE GetProductsByCategory(IN category_name VARCHAR(100))
BEGIN
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.name = category_name AND p.is_active = TRUE
    ORDER BY p.name;
END //

-- Procedure to create new order with items
CREATE PROCEDURE CreateOrderWithItems(
    IN p_customer_name VARCHAR(100),
    IN p_customer_email VARCHAR(100),
    IN p_customer_phone VARCHAR(20),
    IN p_company_name VARCHAR(100),
    IN p_message TEXT,
    IN p_items JSON
)
BEGIN
    DECLARE order_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE item_product_id INT;
    DECLARE item_quantity INT;
    DECLARE item_notes TEXT;
    
    DECLARE item_cursor CURSOR FOR 
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(item, '$.productId')) as product_id,
            JSON_UNQUOTE(JSON_EXTRACT(item, '$.quantity')) as quantity,
            JSON_UNQUOTE(JSON_EXTRACT(item, '$.notes')) as notes
        FROM JSON_TABLE(p_items, '$[*]' COLUMNS (item JSON PATH '$')) as items;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    -- Insert order
    INSERT INTO orders (customer_name, customer_email, customer_phone, company_name, message)
    VALUES (p_customer_name, p_customer_email, p_customer_phone, p_company_name, p_message);
    
    SET order_id = LAST_INSERT_ID();
    
    -- Insert order items
    OPEN item_cursor;
    read_loop: LOOP
        FETCH item_cursor INTO item_product_id, item_quantity, item_notes;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        INSERT INTO order_items (order_id, product_id, quantity, notes)
        VALUES (order_id, item_product_id, item_quantity, item_notes);
    END LOOP;
    CLOSE item_cursor;
    
    -- Update total items count
    UPDATE orders 
    SET total_items = (SELECT SUM(quantity) FROM order_items WHERE order_id = orders.id)
    WHERE id = order_id;
    
    COMMIT;
    
    SELECT order_id as id;
END //

-- Procedure to get order analytics
CREATE PROCEDURE GetOrderAnalytics(IN days_back INT)
BEGIN
    SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        AVG(total_items) as avg_items_per_order,
        DATE(created_at) as order_date
    FROM orders 
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL days_back DAY)
    GROUP BY DATE(created_at)
    ORDER BY order_date DESC;
END //

DELIMITER ;