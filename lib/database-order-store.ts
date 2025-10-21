import { supabase } from './supabase'
import type { Order } from './types'

export class DatabaseOrderStore {
  static async addOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    try {
      console.log('Attempting to save order to Supabase...')
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Order data:', JSON.stringify(orderData, null, 2))
      
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_number: orderData.orderNumber,
          customer_info: orderData.customerInfo,
          items: orderData.items,
          packaging_option: orderData.packagingOption,
          final_packaging: orderData.finalPackaging,
          packaging_details: orderData.packagingDetails,
          total_amount: orderData.totalAmount,
          status: orderData.status,
          order_date: orderData.orderDate.toISOString(),
          notes: orderData.notes,
          cutting_quantity: orderData.cuttingQuantity
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`)
      }
      
      console.log('Order saved successfully to Supabase:', data)
      return data.id.toString()
    } catch (error) {
      console.error('Full error object:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', (error as any)?.constructor?.name)
      
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`)
      } else {
        throw new Error(`Database error: ${JSON.stringify(error)}`)
      }
    }
  }

  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw error
      }
      
      return {
        id: data.id.toString(),
        orderNumber: data.order_number,
        customerInfo: data.customer_info,
        items: data.items || [],
        packagingOption: data.packaging_option,
        finalPackaging: data.final_packaging,
        packagingDetails: data.packaging_details,
        totalAmount: data.total_amount,
        status: data.status,
        orderDate: new Date(data.order_date),
        notes: data.notes,
        cuttingQuantity: data.cutting_quantity
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }

  static async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error fetching orders:', error)
        throw error
      }
      
      console.log('Orders fetched from Supabase:', data?.length || 0)
      
      return data?.map(row => ({
        id: row.id.toString(),
        orderNumber: row.order_number,
        customerInfo: row.customer_info,
        items: row.items || [],
        packagingOption: row.packaging_option,
        finalPackaging: row.final_packaging,
        packagingDetails: row.packaging_details,
        totalAmount: row.total_amount,
        status: row.status,
        orderDate: new Date(row.order_date),
        notes: row.notes,
        cuttingQuantity: row.cutting_quantity
      })) || []
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }
}