import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Test basic connection and check table structure
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('Connection test successful')
    console.log('Sample order data structure:', data?.[0] || 'No orders found')
    return true
  } catch (error) {
    console.error('Connection test error:', error)
    return false
  }
}