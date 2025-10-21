"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      category: product.category || 'general',
      imageUrl: product.imageUrl || '',
      cuttingQuantity: quantity,
      specifications: product.specifications
    }
    addItem(cartItem)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    toast({
      title: "Added to Cart",
      description: `${quantity}kg of ${product.name} added to cart`,
    })
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "made-to-order":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="group interactive-card hover-lift hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] h-32 overflow-hidden rounded-t-lg bg-muted">
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              quality={95}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-3 text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
        
        <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {product.category?.replace('-', ' ') || 'General'}
          </Badge>
          <Badge className={getAvailabilityColor(product.availability)} variant="secondary">
            {product.availability?.replace('-', ' ') || 'Available'}
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Quantity (kg)</label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={handleAddToCart}
          disabled={product.availability === "out-of-stock"}
          className={`flex-1 transition-all duration-300 magnetic ${
            isAdded 
              ? "bg-green-600 hover:bg-green-700 animate-heartbeat" 
              : "bg-primary hover:bg-primary/90 hover-glow"
          }`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAdded ? "✓ Added!" : "Add to Cart"}
        </Button>
        <Link href={`/product/${product.id}`}>
          <Button variant="outline" size="icon" className="transition-all duration-300 hover:bg-primary/10 hover:border-primary">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
