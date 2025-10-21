import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, ProductCategory } from "./types"
import { products as initialProducts } from "./products-data"

interface ProductStore {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (category: ProductCategory) => Product[]
}

// Add default values to existing products
const enhancedProducts: Product[] = initialProducts.map((product, index) => ({
  ...product,
  description: `High-quality rubber gasket - ${product.name}`,
  pricePerKg: Math.floor(Math.random() * 500) + 100, // Random price between 100-600
  minOrderQuantity: [10, 25, 50, 100][Math.floor(Math.random() * 4)], // Random min order
  availability: ["in-stock", "made-to-order", "out-of-stock"][Math.floor(Math.random() * 3)] as Product["availability"]
}))

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: enhancedProducts,

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