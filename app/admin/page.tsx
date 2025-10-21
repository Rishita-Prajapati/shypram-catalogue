"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/lib/admin-store"
import { useProductStore } from "@/lib/product-store"
// Real-time data from database
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, CheckCircle, Calendar, Eye, ArrowUpRight, Activity } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAdminStore()
  const { products } = useProductStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Real-time metrics from database
  const totalProducts = 0 // Will be populated from database
  const totalOrders = 0 // Will be populated from database
  const pendingOrders = 0 // Will be populated from database
  const completedOrders = 0 // Will be populated from database

  const inStockProducts = 0 // Will be populated from database
  const outOfStockProducts = 0 // Will be populated from database

  const recentOrders: any[] = [] // Will be populated from database

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <main className="flex-1 p-6 pt-20">
        <div className="container mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold neon-text">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your business metrics</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card hover-glow transition-all duration-300 border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalProducts}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {inStockProducts} in stock, {outOfStockProducts} out of stock
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow transition-all duration-300 border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {pendingOrders} pending orders
                </p>
              </CardContent>
            </Card>



            <Card className="glass-card hover-glow transition-all duration-300 border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Unique companies
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="glass-card hover-glow transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => router.push("/admin/orders")}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders yet</p>
                      <p className="text-sm">Orders will appear here when customers place them</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">{order.customerInfo.companyName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {order.orderDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1 justify-end">
                            {order.status === "pending" && <AlertCircle className="h-3 w-3 text-muted-foreground" />}
                            {order.status === "confirmed" && <CheckCircle className="h-3 w-3 text-primary" />}
                            {order.status === "processing" && <AlertCircle className="h-3 w-3 text-primary" />}
                            <span className="text-xs capitalize px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Status */}
            <Card className="glass-card hover-glow transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Status
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => router.push("/admin/products")}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">In Stock</span>
                    </div>
                    <span className="font-bold text-primary">{inStockProducts}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">Made to Order</span>
                    </div>
                    <span className="font-bold text-muted-foreground">0</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-destructive/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10 rounded-full">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      </div>
                      <span className="font-medium">Out of Stock</span>
                    </div>
                    <span className="font-bold text-destructive">{outOfStockProducts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
