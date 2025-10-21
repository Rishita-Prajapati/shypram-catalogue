# Shypram Rubber Catalogue - Database Scripts

This folder contains all SQL scripts for setting up and managing the Shypram Rubber Catalogue database.

## Script Execution Order

Execute the scripts in the following order for a complete database setup:

1. **01_create_database.sql** - Creates the main database
2. **02_create_tables.sql** - Creates all necessary tables
3. **03_insert_categories.sql** - Inserts product categories
4. **04_insert_admin_user.sql** - Creates default admin user
5. **05_create_indexes.sql** - Creates performance indexes
6. **06_create_views.sql** - Creates useful database views
7. **07_create_procedures.sql** - Creates stored procedures
8. **08_create_triggers.sql** - Creates database triggers
9. **09_backup_restore.sql** - Backup and maintenance commands
10. **10_sample_data.sql** - Sample data for testing (optional)

## Quick Setup

To set up the entire database quickly:

```bash
# Execute all scripts in order
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_create_tables.sql
mysql -u root -p < 03_insert_categories.sql
mysql -u root -p < 04_insert_admin_user.sql
mysql -u root -p < 05_create_indexes.sql
mysql -u root -p < 06_create_views.sql
mysql -u root -p < 07_create_procedures.sql
mysql -u root -p < 08_create_triggers.sql
mysql -u root -p < 10_sample_data.sql
```

## Database Schema Overview

### Core Tables
- **categories** - Product categories (8 main categories)
- **products** - Product catalog with specifications
- **admin_users** - Admin panel authentication
- **orders** - Customer order inquiries
- **order_items** - Individual items in orders
- **contact_inquiries** - Contact form submissions
- **analytics_events** - System analytics tracking

### Key Features
- Full-text search on products and inquiries
- JSON specifications for flexible product data
- Automated order total calculations via triggers
- Analytics event logging
- Comprehensive indexing for performance

## Environment Variables

Make sure to set up the following environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shypram_catalogue
DB_USER=your_username
DB_PASSWORD=your_password
```

## Security Notes

- Change the default admin password after setup
- Use environment variables for database credentials
- Enable SSL for production database connections
- Regular backup schedule recommended

## Maintenance

- Run backup scripts regularly (09_backup_restore.sql)
- Monitor table sizes and optimize as needed
- Review analytics data for insights
- Clean up old analytics events periodically