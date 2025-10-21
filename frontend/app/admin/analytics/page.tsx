"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAdminStore } from "@/lib/admin-store"
import { mockProducts } from "@/lib/mock-data"
import { mockOrders } from "@/lib/mock-orders"
import { useToast } from "@/hooks/use-toast"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAdminStore()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Calculate analytics data
  const totalOrders = mockOrders.length
  const totalProducts = mockProducts.length
  const totalCustomers = new Set(mockOrders.map(o => o.customerInfo.companyName)).size

  // Category performance
  const categoryStats = mockProducts.reduce((acc, product) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = { count: 0 }
    }
    acc[category].count += 1
    return acc
  }, {} as Record<string, { count: number }>)

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 5)

  // Order status distribution
  const statusStats = mockOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Recent performance metrics (simulated)
  const metrics = {
    orders: { current: totalOrders, previous: Math.floor(totalOrders * 0.92), change: 8 },
    customers: { current: totalCustomers, previous: Math.floor(totalCustomers * 0.88), change: 12 },
    products: { current: totalProducts, previous: totalProducts - 5, change: 2 }
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
  }

  const handleGenerateMonthlyReport = () => {
    // Generate CSV report with monthly data
    const reportData = {
      period: `Monthly Report - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      totalOrders,
      totalProducts,
      totalCustomers,
      topCategories: topCategories.map(([category, stats]) => ({ category, count: stats.count })),
      orderStatus: Object.entries(statusStats).map(([status, count]) => ({ status, count }))
    }
    
    const csvContent = `Monthly Analytics Report\n` +
      `Generated: ${new Date().toLocaleString()}\n\n` +
      `Summary:\n` +
      `Total Orders: ${totalOrders}\n` +
      `Total Products: ${totalProducts}\n` +
      `Total Customers: ${totalCustomers}\n\n` +
      `Top Categories:\n` +
      topCategories.map(([category, stats]) => `${category}: ${stats.count} products`).join('\n') + '\n\n' +
      `Order Status Distribution:\n` +
      Object.entries(statusStats).map(([status, count]) => `${status}: ${count} orders`).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `monthly-report-${new Date().toISOString().slice(0, 7)}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Report Generated",
      description: "Monthly report has been downloaded successfully.",
    })
  }

  const handleExportCustomerData = () => {
    // Export customer data
    const customerData = Array.from(new Set(mockOrders.map(o => o.customerInfo.companyName)))
      .map(companyName => {
        const customerOrders = mockOrders.filter(o => o.customerInfo.companyName === companyName)
        const firstOrder = customerOrders[0]
        return {
          companyName,
          contactPerson: firstOrder.customerInfo.contactPerson,
          email: firstOrder.customerInfo.email,
          phone: firstOrder.customerInfo.phone,
          address: firstOrder.customerInfo.address,
          totalOrders: customerOrders.length,
          lastOrderDate: Math.max(...customerOrders.map(o => o.orderDate.getTime()))
        }
      })
    
    const csvContent = 'Company Name,Contact Person,Email,Phone,Address,Total Orders,Last Order Date\n' +
      customerData.map(customer => 
        `"${customer.companyName}","${customer.contactPerson}","${customer.email}","${customer.phone}","${customer.address}",${customer.totalOrders},"${new Date(customer.lastOrderDate).toLocaleDateString()}"`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customer-data-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Customer Data Exported",
      description: "Customer data has been downloaded successfully.",
    })
  }

  const handleViewDetailedAnalytics = () => {
    setShowDetailedAnalytics(true)
  }

  // Calculate additional detailed metrics
  const avgOrdersPerCustomer = (totalOrders / totalCustomers).toFixed(1)
  const mostActiveCustomer = Array.from(new Set(mockOrders.map(o => o.customerInfo.companyName)))
    .map(company => ({
      company,
      orders: mockOrders.filter(o => o.customerInfo.companyName === company).length
    }))
    .sort((a, b) => b.orders - a.orders)[0]
  
  const recentOrderTrend = mockOrders
    .filter(order => {
      const orderDate = new Date(order.orderDate)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return orderDate >= thirtyDaysAgo
    }).length

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <main className="flex-1 p-6 pt-20">
        <div className="container mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Analytics & Reports
              </h1>
              <p className="text-muted-foreground">Insights into your business performance</p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                    <div className={`flex items-center gap-1 text-sm ${getChangeColor(metrics.orders.change)}`}>
                      {getChangeIcon(metrics.orders.change)}
                      +{metrics.orders.change}% from last period
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                    <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
                    <div className={`flex items-center gap-1 text-sm ${getChangeColor(metrics.customers.change)}`}>
                      {getChangeIcon(metrics.customers.change)}
                      +{metrics.customers.change}% from last period
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                    <div className={`flex items-center gap-1 text-sm ${getChangeColor(metrics.products.change)}`}>
                      {getChangeIcon(metrics.products.change)}
                      +{metrics.products.change}% from last period
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map(([category, stats], index) => (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {category.replace("-", " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stats.count} products
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{stats.count} items</p>
                        <Progress value={(stats.count / Math.max(...topCategories.map(([,s]) => s.count))) * 100} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statusStats).map(([status, count]) => {
                    const percentage = (count / totalOrders) * 100
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case "pending": return "bg-yellow-500"
                        case "confirmed": return "bg-blue-500"
                        case "processing": return "bg-purple-500"
                        case "shipped": return "bg-indigo-500"
                        case "delivered": return "bg-green-500"
                        case "cancelled": return "bg-red-500"
                        default: return "bg-gray-500"
                      }
                    }

                    return (
                      <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`} />
                          <span className="font-medium capitalize">{status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={handleGenerateMonthlyReport}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Generate Monthly Report</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={handleExportCustomerData}
                >
                  <Download className="h-6 w-6" />
                  <span>Export Customer Data</span>
                </Button>
                <Dialog open={showDetailedAnalytics} onOpenChange={setShowDetailedAnalytics}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all"
                      onClick={handleViewDetailedAnalytics}
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span>View Detailed Analytics</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Detailed Analytics Report
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                            <div className="text-sm text-muted-foreground">Total Orders</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{totalCustomers}</div>
                            <div className="text-sm text-muted-foreground">Customers</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{avgOrdersPerCustomer}</div>
                            <div className="text-sm text-muted-foreground">Avg Orders/Customer</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{recentOrderTrend}</div>
                            <div className="text-sm text-muted-foreground">Orders (30 days)</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Top Customer */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Top Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{mostActiveCustomer?.company}</p>
                              <p className="text-sm text-muted-foreground">{mostActiveCustomer?.orders} orders placed</p>
                            </div>
                            <Badge variant="secondary">{((mostActiveCustomer?.orders || 0) / totalOrders * 100).toFixed(1)}% of total</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Category Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Product Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {topCategories.map(([category, stats]) => (
                              <div key={category} className="flex items-center justify-between">
                                <span className="capitalize">{category.replace('-', ' ')}</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={(stats.count / totalProducts) * 100} className="w-24" />
                                  <span className="text-sm font-medium">{stats.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Order Status Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Order Status Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(statusStats).map(([status, count]) => (
                              <div key={status} className="text-center p-3 border rounded-lg">
                                <div className="text-xl font-bold">{count}</div>
                                <div className="text-sm capitalize text-muted-foreground">{status}</div>
                                <div className="text-xs text-muted-foreground">
                                  {((count / totalOrders) * 100).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}