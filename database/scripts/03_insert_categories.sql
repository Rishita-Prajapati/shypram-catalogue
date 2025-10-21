-- Categories Data Insert Script
-- Inserts all product categories based on the application structure

USE shypram_catalogue;

INSERT INTO categories (name, description, image_url) VALUES
('Rubber Sheets', 'High-quality rubber sheets for various industrial applications', '/images/categories/rubber-sheets.jpg'),
('Rubber Mats', 'Durable rubber mats for flooring and safety applications', '/images/categories/rubber-mats.jpg'),
('Rubber Gaskets', 'Precision rubber gaskets for sealing applications', '/images/categories/rubber-gaskets.jpg'),
('Rubber Hoses', 'Flexible rubber hoses for fluid transfer systems', '/images/categories/rubber-hoses.jpg'),
('Rubber Seals', 'Industrial rubber seals for various machinery', '/images/categories/rubber-seals.jpg'),
('Rubber Rollers', 'Custom rubber rollers for printing and manufacturing', '/images/categories/rubber-rollers.jpg'),
('Rubber Profiles', 'Extruded rubber profiles for construction and automotive', '/images/categories/rubber-profiles.jpg'),
('Custom Products', 'Bespoke rubber products manufactured to specifications', '/images/categories/custom-products.jpg');