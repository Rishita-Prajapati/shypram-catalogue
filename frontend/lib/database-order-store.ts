import { supabase } from './supabase'
import type { Order } from './types'

export class DatabaseOrderStore {
  static async addOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    try {
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_number: orderData.orderNumber,
          customer_info: orderData.customerInfo,
          items: orderData.items,
          packaging_option: orderData.packagingOption,
          final_packaging: orderData.finalPackaging,
          packaging_details: orderData.packagingDetails || null,
          total_amount: orderData.totalAmount,
          status: orderData.status,
          order_date: now,
          notes: orderData.notes || null,
          created_at: now
        }])
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error saving order:', error)
      throw error
    }
  }

  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single()

      if (error) throw error
      
      return {
        id: data.id,
        orderNumber: data.order_number,
        customerInfo: data.customer_info,
        items: data.items,
        packagingOption: data.packaging_option,
        finalPackaging: data.final_packaging,
        packagingDetails: data.packaging_details,
        totalAmount: data.total_amount,
        status: data.status,
        orderDate: new Date(data.order_date),
        notes: data.notes
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

      if (error) throw error
      
      return data.map(row => ({
        id: row.id,
        orderNumber: row.order_number,
        customerInfo: row.customer_info,
        items: row.items,
        packagingOption: row.packaging_option,
        finalPackaging: row.final_packaging,
        packagingDetails: row.packaging_details,
        totalAmount: row.total_amount,
        status: row.status,
        orderDate: new Date(row.order_date),
        notes: row.notes
      }))
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }
}