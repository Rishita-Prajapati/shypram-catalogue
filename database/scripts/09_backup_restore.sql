-- Backup and Restore Scripts
-- Commands for database backup and restoration

-- =============================================
-- BACKUP COMMANDS (Run from command line)
-- =============================================

-- Full database backup
-- mysqldump -u username -p shypram_catalogue > shypram_catalogue_backup_$(date +%Y%m%d_%H%M%S).sql

-- Backup with compression
-- mysqldump -u username -p shypram_catalogue | gzip > shypram_catalogue_backup_$(date +%Y%m%d_%H%M%S).sql.gz

-- Backup specific tables
-- mysqldump -u username -p shypram_catalogue products categories > products_backup.sql

-- Backup structure only (no data)
-- mysqldump -u username -p --no-data shypram_catalogue > shypram_catalogue_structure.sql

-- =============================================
-- RESTORE COMMANDS (Run from command line)
-- =============================================

-- Restore from backup
-- mysql -u username -p shypram_catalogue < backup_file.sql

-- Restore from compressed backup
-- gunzip < backup_file.sql.gz | mysql -u username -p shypram_catalogue

-- =============================================
-- MAINTENANCE QUERIES
-- =============================================

USE shypram_catalogue;

-- Check table sizes
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'shypram_catalogue'
ORDER BY (data_length + index_length) DESC;

-- Optimize all tables
-- OPTIMIZE TABLE categories, products, orders, order_items, contact_inquiries, admin_users, analytics_events;

-- Check table status
-- SHOW TABLE STATUS FROM shypram_catalogue;