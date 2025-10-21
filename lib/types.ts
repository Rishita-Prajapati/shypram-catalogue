// Product category types based on the specification
export type ProductCategory =
  | "alluminium-doors-windows-gasket"
  | "container-gasket"
  | "facade-rubber-gasket"
  | "profiles-alluminium-doors-windows"
  | "profiles-u-clamp-c-clamp"
  | "railing-rubber-gasket"
  | "sliding-folding-rubber-gasket"
  | "upvc-door-window-gasket"

// Product interface - Complete structure for admin management
export interface Product {
  id: string
  name: string // Product Code
  category: ProductCategory
  imageUrl: string
  cuttingQuantity: number // User input
  description?: string
  pricePerKg?: number
  minOrderQuantity?: number
  availability?: "in-stock" | "made-to-order" | "out-of-stock"
  specifications?: string[]
}

// Cart item interface
export interface CartItem {
  productId: string
  product: Product
  cuttingQuantity: number
}

// Order interface
export interface Order {
  id: string
  orderNumber: string
  customerInfo: {
    companyName: string
    contactPerson?: string
    email?: string
    phone: string
    address: string
  }
  items: CartItem[]
  packagingOption: "printed" | "plain"
  finalPackaging: "box" | "bag"
  packagingDetails?: {
    bagsCount: number
    kgPerBag: number
  }
  totalAmount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: Date
  estimatedDelivery?: Date
  notes?: string
  cuttingQuantity?: number
}

// Category display information
export interface CategoryInfo {
  id: ProductCategory
  name: string
  description: string
  icon: string
}
