"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Contact Us for Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-lg">
                To place an order or get a personalized quote, please reach out to us directly. 
                Our team will assist you with pricing and availability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cart">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Package className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </div>

              <div className="pt-4">
                <Link href="/catalogue">
                  <Button variant="ghost" className="text-muted-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Catalogue
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}