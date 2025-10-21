import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8 space-y-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">404</h1>
              <h2 className="text-xl font-semibold text-foreground">Admin Page Not Found</h2>
              <p className="text-muted-foreground">
                The admin page you're looking for doesn't exist. Check your permissions or navigate back to the dashboard.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default">
                <Link href="/admin" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="javascript:history.back()" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}