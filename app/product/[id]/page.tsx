import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, Mail } from "lucide-react"
import { getProductById } from "@/lib/mock-data"
import Link from "next/link"

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const { products } = await import('@/lib/products-data')
  return products.map((product) => ({
    id: product.id,
  }))
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const productId = id
  const product = getProductById(productId)

  if (!product) {
    notFound()
  }



  const getAvailabilityColor = (availability: typeof product.availability) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "made-to-order":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }
  }

  const getAvailabilityText = (availability: typeof product.availability) => {
    switch (availability) {
      case "in-stock":
        return "In Stock"
      case "made-to-order":
        return "Made to Order"
      case "out-of-stock":
        return "Out of Stock"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-primary">
              Catalogue
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image 
                  src={product.imageUrl || "/placeholder.svg"} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                  quality={100}
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                <Badge className={getAvailabilityColor(product.availability)}>
                  {getAvailabilityText(product.availability)}
                </Badge>
              </div>

              <p className="text-muted-foreground text-lg">{product.description}</p>

              {/* Contact for Inquiry */}
              <Card>
                <CardHeader>
                  <CardTitle>Get Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Contact us for pricing and availability information.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full" size="lg">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Us
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.specifications?.map((spec, index) => (
                      <li key={index} className="text-sm">
                        <span className="text-muted-foreground">•</span> {spec}
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No specifications available</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
