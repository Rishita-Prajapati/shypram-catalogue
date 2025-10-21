-- Sample Data Script
-- Inserts sample data for testing and development

USE shypram_catalogue;

-- Sample products for each category
INSERT INTO products (name, description, category_id, image_url, specifications) VALUES
-- Rubber Sheets (category_id: 1)
('Industrial Rubber Sheet - Black', 'High-quality black rubber sheet for industrial applications', 1, '/images/products/rubber-sheet-black.jpg', '{"thickness": "3mm", "hardness": "60 Shore A", "material": "NBR"}'),
('Food Grade Rubber Sheet', 'FDA approved rubber sheet for food industry', 1, '/images/products/rubber-sheet-food.jpg', '{"thickness": "5mm", "hardness": "70 Shore A", "material": "Silicone"}'),
('Anti-Static Rubber Sheet', 'ESD safe rubber sheet for electronics', 1, '/images/products/rubber-sheet-antistatic.jpg', '{"thickness": "2mm", "hardness": "65 Shore A", "material": "Conductive NBR"}'),

-- Rubber Mats (category_id: 2)
('Safety Rubber Mat', 'Non-slip safety mat for industrial floors', 2, '/images/products/safety-mat.jpg', '{"size": "1m x 1m", "thickness": "10mm", "pattern": "Diamond"}'),
('Entrance Rubber Mat', 'Heavy-duty entrance mat with drainage', 2, '/images/products/entrance-mat.jpg', '{"size": "1.5m x 0.9m", "thickness": "15mm", "drainage": "Yes"}'),
('Gym Rubber Flooring', 'Shock-absorbing rubber flooring for gyms', 2, '/images/products/gym-flooring.jpg', '{"size": "1m x 1m", "thickness": "20mm", "shock_absorption": "High"}'),

-- Rubber Gaskets (category_id: 3)
('O-Ring Gasket Set', 'Standard O-ring gaskets in various sizes', 3, '/images/products/o-ring-set.jpg', '{"material": "Viton", "temperature_range": "-20°C to 200°C", "sizes": "Multiple"}'),
('Flange Gasket', 'Custom flange gasket for pipe connections', 3, '/images/products/flange-gasket.jpg', '{"material": "EPDM", "pressure_rating": "16 bar", "size": "Custom"}'),
('Valve Seat Gasket', 'Precision valve seat gasket', 3, '/images/products/valve-gasket.jpg', '{"material": "NBR", "hardness": "75 Shore A", "application": "Valve sealing"}'),

-- Sample orders
INSERT INTO orders (customer_name, customer_email, customer_phone, company_name, message, status, total_items) VALUES
('John Smith', 'john@example.com', '+1234567890', 'ABC Manufacturing', 'Need rubber sheets for production line', 'pending', 5),
('Sarah Johnson', 'sarah@techcorp.com', '+1987654321', 'TechCorp Industries', 'Inquiry about anti-static mats', 'processing', 3),
('Mike Wilson', 'mike@construction.com', '+1122334455', 'Wilson Construction', 'Safety mats for construction site', 'completed', 10);

-- Sample order items
INSERT INTO order_items (order_id, product_id, quantity, notes) VALUES
(1, 1, 3, 'Need 3mm thickness'),
(1, 2, 2, 'Food grade required'),
(2, 3, 3, 'For electronics assembly'),
(3, 4, 10, 'Various sizes needed');

-- Sample contact inquiries
INSERT INTO contact_inquiries (name, email, phone, subject, message, status) VALUES
('Alice Brown', 'alice@email.com', '+1555666777', 'Custom Rubber Products', 'I need custom rubber gaskets for my machinery. Can you help?', 'new'),
('Bob Davis', 'bob@company.com', '+1444555666', 'Bulk Order Inquiry', 'Looking for bulk pricing on rubber mats for our facility.', 'read'),
('Carol White', 'carol@business.com', '+1333444555', 'Technical Specifications', 'Need detailed specs for high-temperature rubber sheets.', 'replied');