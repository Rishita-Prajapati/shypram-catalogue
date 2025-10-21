"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Mail, Phone, MapPin } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  if (!order) return null

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "processing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "shipped":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }
  }

  const totalQuantity = order.items.reduce((sum, item) => sum + item.cuttingQuantity, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNumber}</span>
            <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Order Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{order.orderDate.toLocaleDateString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Estimated Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{order.estimatedDelivery?.toLocaleDateString() || "TBD"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{order.customerInfo.companyName}</h4>
                  <p className="text-muted-foreground">{order.customerInfo.contactPerson}</p>

                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{order.customerInfo.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 overflow-hidden rounded border">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.product.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Quantity: {item.cuttingQuantity}kg</span>
                        <span>Unit Price: ₹{item.product.pricePerKg || 0}/kg</span>
                        <span className="font-semibold">Total: ₹{((item.product.pricePerKg || 0) * item.cuttingQuantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Quantity: {totalQuantity}kg</p>
                  <p className="text-sm text-muted-foreground">
                    Packaging: {order.packagingOption === "plain" ? "Plain" : "Printed"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold mb-2">Order Notes</h4>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
