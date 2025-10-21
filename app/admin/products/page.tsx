"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAdminStore } from "@/lib/admin-store"
import { useProductStore } from "@/lib/product-store"
import { exportProductsToCSV } from "@/lib/csv-export"
import { AddProductDialog } from "@/components/add-product-dialog"
import { EditProductDialog } from "@/components/edit-product-dialog"
import { Search, Plus, Edit, Trash2, Download, Filter, Package, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/types"

export default function AdminProductsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAdminStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const { products, deleteProduct } = useProductStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Real-time products from database (empty initially)
  const filteredProducts: any[] = []
  const categories: string[] = []

  const getAvailabilityColor = (availability: Product["availability"]) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "made-to-order":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }
  }

  const getAvailabilityText = (availability: Product["availability"]) => {
    switch (availability) {
      case "in-stock":
        return "In Stock"
      case "made-to-order":
        return "Made to Order"
      case "out-of-stock":
        return "Out of Stock"
    }
  }

  const handleExportProducts = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    exportProductsToCSV(filteredProducts, `products-${timestamp}.csv`)

    toast({
      title: "Export Successful",
      description: `${filteredProducts.length} products exported to CSV`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <main className="flex-1 p-6 pt-20">
        <div className="container mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground">Manage your product catalogue</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportProducts}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <AddProductDialog />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Products</span>
                </div>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">In Stock</span>
                </div>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Made to Order</span>
                </div>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Product Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search products, categories, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="made-to-order">Made to Order</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Table */}
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16 min-w-16">Image</TableHead>
                        <TableHead className="min-w-48">Product Name</TableHead>
                        <TableHead className="min-w-32">Category</TableHead>
                        <TableHead className="min-w-32">Status</TableHead>
                        <TableHead className="text-right min-w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="relative w-12 h-12 overflow-hidden rounded border">
                            <Image
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{product.category.replace("-", " ")}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAvailabilityColor(product.availability)}>
                            {getAvailabilityText(product.availability)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingProduct(product)
                                setEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products added yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add your first product to get started.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Product Dialog */}
          {editingProduct && (
            <EditProductDialog
              product={editingProduct}
              open={editDialogOpen}
              onOpenChange={(open) => {
                setEditDialogOpen(open)
                if (!open) setEditingProduct(null)
              }}
            />
          )}
        </div>
      </main>
    </div>
  )

  function handleDeleteProduct(productId: string, productName: string) {
    if (confirm(`Are you sure you want to delete ${productName}? This action cannot be undone.`)) {
      deleteProduct(productId)
      toast({
        title: "Product Deleted",
        description: `${productName} has been removed from the catalogue`,
      })
    }
  }
}
