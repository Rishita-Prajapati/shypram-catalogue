"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { mockProducts, categories } from "@/lib/mock-data"
import type { ProductCategory } from "@/lib/types"

interface CategoryPageProps {
  params: { id: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.id as ProductCategory
  const category = categories.find(c => c.id === categoryId)
  const products = mockProducts.filter(p => p.category === categoryId)

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <p className="text-muted-foreground">The requested category does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">{category.name}</h1>
            <p className="text-muted-foreground text-lg">{category.description}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <p className="text-muted-foreground mb-8">
              Showing {products.length} product{products.length !== 1 ? "s" : ""}
            </p>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}