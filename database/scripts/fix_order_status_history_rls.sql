-- =============================================
-- FIX ORDER STATUS HISTORY RLS POLICY
-- Allow triggers to insert into order_status_history
-- =============================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow trigger insert order_status_history" ON order_status_history;
DROP POLICY IF EXISTS "Admin read order_status_history" ON order_status_history;

-- Create policies for order_status_history table
-- Allow system/triggers to insert (this is needed for the trigger to work)
CREATE POLICY "Allow trigger insert order_status_history" ON order_status_history
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Admin read order_status_history" ON order_status_history
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update/delete if needed
CREATE POLICY "Admin full access order_status_history" ON order_status_history
FOR ALL USING (auth.role() = 'authenticated');