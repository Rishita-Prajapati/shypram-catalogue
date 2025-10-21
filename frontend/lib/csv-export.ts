import type { Order, Product } from './types'

export function exportProductsToCSV(products: Product[], filename?: string): void {
  const headers = [
    'Product Name',
    'Category',
    'Description',
    'Availability',
    'Image URL'
  ]

  const csvData = products.map(product => [
    product.name,
    product.category,
    product.description,
    product.availability,
    product.imageUrl || ''
  ])

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `products-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

export function exportOrdersToCSV(orders: Order[]): void {
  const headers = [
    'Order Number',
    'Company Name', 
    'Phone',
    'Address',
    'Products',
    'Total Quantity (kg)',
    'Bag Type',
    'Final Packaging',
    'Status',
    'Order Date'
  ]

  const csvData = orders.map(order => [
    order.orderNumber,
    order.customerInfo.companyName,
    order.customerInfo.phone,
    order.customerInfo.address,
    order.items.map(item => `${item.product.name} (${item.cuttingQuantity}kg)`).join('; '),
    order.items.reduce((sum, item) => sum + item.cuttingQuantity, 0),
    order.packagingOption,
    order.finalPackaging,
    order.status,
    order.orderDate.toLocaleDateString()
  ])

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}