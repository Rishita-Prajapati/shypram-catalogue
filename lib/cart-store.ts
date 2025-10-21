import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  category: string
  imageUrl: string
  cuttingQuantity: number
  specifications?: any
}

interface CartStore {
  items: CartItem[]
  cuttingQuantity: string
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateCuttingQuantity: (quantity: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalWeight: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cuttingQuantity: "",
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id 
                ? { ...i, cuttingQuantity: i.cuttingQuantity + item.cuttingQuantity }
                : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, cuttingQuantity: quantity } : item
        )
      })),
      
      updateCuttingQuantity: (quantity) => set({ cuttingQuantity: quantity }),
      
      clearCart: () => set({ items: [], cuttingQuantity: "" }),
      
      getTotalItems: () => get().items.length,
      
      getTotalWeight: () => get().items.reduce((total, item) => total + item.cuttingQuantity, 0)
    }),
    {
      name: 'cart-storage'
    }
  )
)