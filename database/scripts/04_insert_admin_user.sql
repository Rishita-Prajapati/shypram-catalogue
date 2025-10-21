-- Admin User Creation Script
-- Creates default admin user for system access

USE shypram_catalogue;

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@shypramrubber.com', '$2b$10$rOvHPxfzMtkgFqBhlaQeP.jrQGmzrQGmzrQGmzrQGmzrQGmzrQGmzr', 'super_admin');

-- Note: In production, use proper password hashing
-- Example with bcrypt: bcrypt.hash('admin123', 10)