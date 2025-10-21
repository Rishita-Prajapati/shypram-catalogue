"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProductStore } from "@/lib/product-store"
import { categories } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { Edit } from "lucide-react"
import type { Product, ProductCategory } from "@/lib/types"

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "" as ProductCategory,
    description: "",
    pricePerKg: "",
    minOrderQuantity: "",
    availability: "in-stock" as const,
    imageUrl: ""
  })

  const { updateProduct } = useProductStore()
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description || "",
        pricePerKg: product.pricePerKg?.toString() || "",
        minOrderQuantity: product.minOrderQuantity?.toString() || "",
        availability: product.availability || "in-stock",
        imageUrl: product.imageUrl || ""
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    updateProduct(product.id, {
      name: formData.name,
      category: formData.category,
      description: formData.description || `High-quality rubber gasket - ${formData.name}`,
      pricePerKg: formData.pricePerKg ? parseFloat(formData.pricePerKg) : 150,
      minOrderQuantity: formData.minOrderQuantity ? parseInt(formData.minOrderQuantity) : 25,
      availability: formData.availability,
      imageUrl: formData.imageUrl || "/placeholder.svg"
    })

    toast({
      title: "Success",
      description: "Product updated successfully"
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Code *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., SR-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerKg">Price per KG (₹)</Label>
              <Input
                id="pricePerKg"
                type="number"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                placeholder="150"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="minOrderQuantity">Min Order (KG)</Label>
              <Input
                id="minOrderQuantity"
                type="number"
                value={formData.minOrderQuantity}
                onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                placeholder="25"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select value={formData.availability} onValueChange={(value: any) => setFormData({ ...formData, availability: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="made-to-order">Made to Order</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/product_images/..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}