import type { Product, CategoryInfo, ProductCategory } from "./types"
import { products as actualProducts } from "./products-data"

// Category information based on product images folder structure
export const categories: CategoryInfo[] = [
  {
    id: "alluminium-doors-windows-gasket",
    name: "Aluminium Doors & Windows Gasket",
    description: "High-quality sealing solutions for aluminium door and window frames",
    icon: "🚪"
  },
  {
    id: "container-gasket",
    name: "Container Gasket",
    description: "Industrial-grade container sealing solutions for shipping and storage",
    icon: "📦"
  },
  {
    id: "facade-rubber-gasket",
    name: "Facade Rubber Gasket",
    description: "Weather-resistant facade sealing systems for building exteriors",
    icon: "🏢"
  },
  {
    id: "profiles-alluminium-doors-windows",
    name: "Profiles for Aluminium Doors & Windows",
    description: "Precision-engineered rubber profiles for aluminium door and window systems",
    icon: "🔧"
  },
  {
    id: "profiles-u-clamp-c-clamp",
    name: "Profiles for U-Clamp & C-Clamp",
    description: "EPDM and Silicon rubber profiles for U-clamp and C-clamp applications",
    icon: "🔩"
  },
  {
    id: "railing-rubber-gasket",
    name: "Railing Rubber Gasket",
    description: "Safety and aesthetic railing gaskets for various applications",
    icon: "🛡️"
  },
  {
    id: "sliding-folding-rubber-gasket",
    name: "Sliding & Folding Rubber Gasket",
    description: "Smooth operation sealing solutions for sliding and folding systems",
    icon: "↔️"
  },
  {
    id: "upvc-door-window-gasket",
    name: "UPVC Door & Window Gasket",
    description: "Durable gaskets specifically designed for UPVC door and window applications",
    icon: "🪟"
  }
]

// Empty product data - Use real-time data from database
export const mockProducts: Product[] = []

// Helper functions for data operations
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return actualProducts.filter(product => product.category === category)
}

export const getProductById = (id: string): Product | undefined => {
  return actualProducts.find(product => product.id === id)
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return actualProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    (product.description && product.description.toLowerCase().includes(lowercaseQuery))
  )
}

export const products = actualProducts