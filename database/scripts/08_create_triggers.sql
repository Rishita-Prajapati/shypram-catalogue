-- Triggers Script
-- Creates database triggers for automated operations

USE shypram_catalogue;

DELIMITER //

-- Trigger to log analytics events when orders are created
CREATE TRIGGER tr_order_created
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO analytics_events (event_type, event_data)
    VALUES ('order_created', JSON_OBJECT(
        'order_id', NEW.id,
        'customer_email', NEW.customer_email,
        'total_items', NEW.total_items
    ));
END //

-- Trigger to update order total items when order items change
CREATE TRIGGER tr_update_order_total_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_items = (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM order_items 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END //

CREATE TRIGGER tr_update_order_total_update
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_items = (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM order_items 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END //

CREATE TRIGGER tr_update_order_total_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_items = (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM order_items 
        WHERE order_id = OLD.order_id
    )
    WHERE id = OLD.order_id;
END //

-- Trigger to log contact inquiries
CREATE TRIGGER tr_contact_inquiry_created
AFTER INSERT ON contact_inquiries
FOR EACH ROW
BEGIN
    INSERT INTO analytics_events (event_type, event_data)
    VALUES ('contact_inquiry', JSON_OBJECT(
        'inquiry_id', NEW.id,
        'email', NEW.email,
        'subject', NEW.subject
    ));
END //

DELIMITER ;