import type { Product, CategoryInfo, ProductCategory } from "./types"

// Category information
export const categories: CategoryInfo[] = [
  {
    id: "alluminium-doors-windows-gasket",
    name: "Alluminium Doors and Windows Gasket",
    description: "High-quality gaskets for aluminum doors and windows",
    icon: "🚪",
  },
  {
    id: "container-gasket",
    name: "Container Gasket",
    description: "Specialized gaskets for container applications",
    icon: "📦",
  },
  {
    id: "facade-rubber-gasket",
    name: "Facade Rubber Gasket",
    description: "Weather-resistant gaskets for building facades",
    icon: "🏢",
  },
  {
    id: "profiles-alluminium-doors-windows",
    name: "Profiles for Alluminium Doors and Windows",
    description: "Custom profiles for aluminum door and window systems",
    icon: "🪟",
  },
  {
    id: "profiles-u-clamp-c-clamp",
    name: "Profiles for U-clamp & C-clamp EPDM Rubber & Silicon Rubber",
    description: "Specialized profiles for clamp applications",
    icon: "🔧",
  },
  {
    id: "railing-rubber-gasket",
    name: "Railing Rubber Gasket",
    description: "Durable gaskets for railing systems",
    icon: "🛡️",
  },
  {
    id: "sliding-folding-rubber-gasket",
    name: "Sliding and Folding Rubber Gasket",
    description: "Flexible gaskets for sliding and folding systems",
    icon: "↔️",
  },
  {
    id: "upvc-door-window-gasket",
    name: "UPVC Door and Window Rubber Gasket",
    description: "Specialized gaskets for UPVC door and window systems",
    icon: "🏠",
  },
]

// Import products from separate file
import { products as importedProducts } from "./products-data"

// Mock product data - Generated from your categorized images (212 products)
// Note: Use useProductStore() hook in components for real-time product data
export const mockProducts: Product[] = importedProducts

// Helper functions for data operations
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts.filter((product) => product.category === category)
}

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id)
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery)
  )
}

export const products = mockProducts
