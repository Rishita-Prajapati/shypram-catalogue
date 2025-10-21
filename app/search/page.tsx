"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { products } from "@/lib/products-data"
import { categories } from "@/lib/mock-data"
import type { ProductCategory } from "@/lib/types"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [initialQuery, setInitialQuery] = useState("")

  useEffect(() => {
    const query = searchParams.get("q") || ""
    setInitialQuery(query)
    setSearchQuery(query)
  }, [searchParams])

  // Search products function
  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Filter and search products
  let filteredProducts = searchQuery ? searchProducts(searchQuery) : products

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory)
  }

  // Sort products by name
  filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">Search Results</h1>
            {initialQuery && (
              <p className="text-muted-foreground text-lg">
                Results for "{initialQuery}"
              </p>
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as ProductCategory | "all")}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchQuery || selectedCategory !== "all") && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && <Badge variant="secondary">Search: "{searchQuery}"</Badge>}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary">Category: {categories.find((c) => c.id === selectedCategory)?.name}</Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria.</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}