import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Order } from "./types"

interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => string
  getOrderByNumber: (orderNumber: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData: Omit<Order, "id">) => {
        const id = Date.now().toString()
        const order: Order = { ...orderData, id }
        
        set((state) => ({
          orders: [...state.orders, order]
        }))
        
        return id
      },

      getOrderByNumber: (orderNumber: string) => {
        return get().orders.find(order => order.orderNumber === orderNumber)
      }
    }),
    {
      name: "shypram-orders-storage"
    }
  )
)