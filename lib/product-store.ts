import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, ProductCategory } from "./types"

interface ProductStore {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (category: ProductCategory) => Product[]
}

export const useProductStore = create<ProductStore>()( 
  persist(
    (set, get) => ({
      products: [], // Empty array - real-time data only

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
        }
        set((state) => ({
          products: [...state.products, newProduct],
        }))
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }))
      },

      getProductById: (id) => {
        return get().products.find((product) => product.id === id)
      },

      getProductsByCategory: (category) => {
        return get().products.filter((product) => product.category === category)
      },
    }),
    {
      name: "product-storage",
    }
  )
)