import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "./product-card"
import { categories, products } from "@/lib/mock-data"

export function CategoryGrid() {
  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const categoryProducts = products.filter((product) => product.category === category.id).slice(0, 4)

        return (
          <div key={category.id} className="space-y-6">
            {/* Category Header */}
            <Link href={`/catalogue/${category.id}`}>
              <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-blue-400 transition-colors text-gray-100">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>

            {categoryProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* View All Link */}
            <div className="text-center">
              <Link
                href={`/catalogue/${category.id}`}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              >
                View All {category.name} Products →
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
