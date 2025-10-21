# Supabase Database Setup (FREE)

## 1. Create Supabase Account
- Go to https://supabase.com
- Sign up for free account
- Create new project

## 2. Create Orders Table
Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_info JSONB NOT NULL,
  items JSONB NOT NULL,
  packaging_option VARCHAR(20) NOT NULL,
  final_packaging VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  order_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. Update Configuration
1. Copy your project URL and anon key from Supabase dashboard
2. Update `lib/supabase.ts`:
   - Replace `supabaseUrl` with your project URL
   - Replace `supabaseKey` with your anon key

## 4. Access Orders
- View orders: `/admin/orders`
- Export CSV: Click "Export CSV" button

## Features
✅ Free database (up to 500MB)
✅ Real-time order saving
✅ Order date/time tracking
✅ CSV export functionality
✅ Admin dashboard