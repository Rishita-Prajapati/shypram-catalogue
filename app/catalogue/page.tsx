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
import { Card, CardContent } from "@/components/ui/card"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Search, Filter, Grid3X3, List, Zap, Layers, Package, Eye } from "lucide-react"
import { products } from "@/lib/products-data"
import { categories, searchProducts } from "@/lib/mock-data"
import type { ProductCategory } from "@/lib/types"

export default function CataloguePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [sortBy, setSortBy] = useState<"name">("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Handle search parameter from URL
  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [searchParams])

  // Filter and search products
  let filteredProducts = products

  if (searchQuery) {
    filteredProducts = searchProducts(searchQuery)
  }

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory)
  }

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("name")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full animate-float blur-sm" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary/5 rounded-full animate-float-reverse blur-sm" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 neon-text">
                {searchQuery ? 'Search Results' : 'Product Catalogue'}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto mb-6 animate-scale-in animate-delay-200" />
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
                {searchQuery 
                  ? `Discover products matching "${searchQuery}"` 
                  : 'Explore our comprehensive range of premium rubber gaskets and sealing solutions'
                }
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              {[
                { icon: Package, label: "Products", value: products.length.toString() },
                { icon: Layers, label: "Categories", value: categories.length.toString() },
                { icon: Zap, label: "In Stock", value: products.filter(p => p.availability === 'in-stock').length.toString() }
              ].map((stat, i) => (
                <Card key={i} className={`glass-card hover-lift animate-bounce-in animate-delay-${(i + 1) * 100}`}>
                  <CardContent className="p-4 text-center">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-foreground/70">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Filter Section */}
        <FilterSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          clearFilters={clearFilters}
          categories={categories}
        />

        {/* Products Section */}
        <ProductsSection 
          filteredProducts={filteredProducts}
          viewMode={viewMode}
          clearFilters={clearFilters}
        />
      </main>

      <Footer />
    </div>
  )
}

function FilterSection({ 
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, 
  sortBy, setSortBy, viewMode, setViewMode, isFilterOpen, setIsFilterOpen,
  clearFilters, categories 
}: any) {
  const [ref, isVisible] = useIntersectionObserver()
  
  return (
    <section ref={ref} className={`sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b fade-in-section ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Main Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Enhanced Search */}
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search products, categories, or specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary/50 hover:border-primary/30 transition-all duration-300 rounded-xl"
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                ×
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-md magnetic"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-md magnetic"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`magnetic hover-lift ${isFilterOpen ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        {isFilterOpen && (
          <div className="mt-6 p-6 bg-muted/30 rounded-xl animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as ProductCategory | "all")}
                >
                  <SelectTrigger className="hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as "name")}
                >
                  <SelectTrigger className="hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground opacity-0">Actions</label>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full magnetic hover:border-destructive hover:text-destructive"
                  disabled={!searchQuery && selectedCategory === 'all'}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="flex flex-wrap gap-2 mt-4 animate-fade-in-up">
            {searchQuery && (
              <Badge variant="secondary" className="hover-glow px-3 py-1">
                <Search className="h-3 w-3 mr-1" />
                "{searchQuery}"
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="hover-glow px-3 py-1">
                <Layers className="h-3 w-3 mr-1" />
                {categories.find((c: any) => c.id === selectedCategory)?.name}
              </Badge>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductsSection({ filteredProducts, viewMode, clearFilters }: any) {
  const [ref, isVisible] = useIntersectionObserver()
  
  return (
    <section ref={ref} className={`py-12 fade-in-section ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto px-4">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {filteredProducts.length > 0 ? 'Products Found' : 'No Results'}
            </h2>
            <p className="text-foreground/70 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
              : 'space-y-6'
          }`}>
            {filteredProducts.map((product: any, index: number) => (
              <div 
                key={product.id} 
                className={`animate-bounce-in animate-delay-${(index % 4 + 1) * 100}`}
              >
                {viewMode === 'grid' ? (
                  <ProductCard product={product} />
                ) : (
                  <ProductListItem product={product} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No Products Found</h3>
            <p className="text-foreground/70 text-lg mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} className="magnetic hover-lift px-8 py-3">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function ProductListItem({ product }: { product: any }) {
  return (
    <Card className="glass-card interactive-card hover-lift group">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-foreground/70 mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hover-glow">
                {product.category?.replace('-', ' ') || 'General'}
              </Badge>
              <Badge 
                variant={product.availability === 'in-stock' ? 'default' : 'secondary'}
                className="hover-glow"
              >
                {product.availability?.replace('-', ' ') || 'Available'}
              </Badge>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
