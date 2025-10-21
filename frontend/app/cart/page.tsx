"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/lib/cart-store"
import { DatabaseOrderStore } from "@/lib/database-order-store"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Package, ShoppingBag } from "lucide-react"
import Image from "next/image"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, removeItem, updateQuantity, clearCart, getTotalWeight } = useCartStore()
  
  const [customerInfo, setCustomerInfo] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: ""
  })
  
  const [packagingOption, setPackagingOption] = useState("plain")
  const [finalPackaging, setFinalPackaging] = useState("box")
  const [packagingDetails, setPackagingDetails] = useState({
    bagsCount: 1,
    kgPerBag: 25
  })
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before placing order",
        variant: "destructive"
      })
      return
    }

    if (!customerInfo.companyName || !customerInfo.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in company name and phone number",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const orderNumber = `ORD-${Date.now()}`
      
      const orderId = await DatabaseOrderStore.addOrder({
        orderNumber,
        customerInfo,
        items: items.map(item => ({
          productId: item.id,
          product: item,
          cuttingQuantity: item.cuttingQuantity
        })),
        packagingOption,
        finalPackaging,
        packagingDetails,
        totalAmount: 0,
        status: "pending",
        orderDate: new Date(),
        notes
      })

      if (orderId) {
        clearCart()
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order ${orderNumber} has been received. We will contact you soon.`,
        })
        
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        throw new Error("Failed to create order")
      }
      
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="text-center max-w-md">
            <CardContent className="pt-6">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-4">Add some products to get started</p>
              <Button onClick={() => router.push("/catalogue")}>
                Browse Catalogue
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            value={item.cuttingQuantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="1"
                          />
                          <span className="text-sm">kg</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="font-semibold">Total Weight: {getTotalWeight()} kg</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Form */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={customerInfo.companyName}
                      onChange={(e) => setCustomerInfo({...customerInfo, companyName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={customerInfo.contactPerson}
                      onChange={(e) => setCustomerInfo({...customerInfo, contactPerson: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Packaging Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Packaging Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Bag Type</Label>
                    <RadioGroup value={packagingOption} onValueChange={setPackagingOption}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="plain" id="plain" />
                        <Label htmlFor="plain">Plain Bag</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="printed" id="printed" />
                        <Label htmlFor="printed">Printed Bag</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Final Packaging</Label>
                    <RadioGroup value={finalPackaging} onValueChange={setFinalPackaging}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="box" id="box" />
                        <Label htmlFor="box">Box Packing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bag" id="bag" />
                        <Label htmlFor="bag">Bag Packing</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bagsCount">Number of Bags</Label>
                      <Input
                        id="bagsCount"
                        type="number"
                        value={packagingDetails.bagsCount}
                        onChange={(e) => setPackagingDetails({
                          ...packagingDetails,
                          bagsCount: parseInt(e.target.value) || 1
                        })}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="kgPerBag">KG per Bag</Label>
                      <Input
                        id="kgPerBag"
                        type="number"
                        value={packagingDetails.kgPerBag}
                        onChange={(e) => setPackagingDetails({
                          ...packagingDetails,
                          kgPerBag: parseInt(e.target.value) || 1
                        })}
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions or requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmitOrder} 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                <Package className="h-4 w-4 mr-2" />
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}