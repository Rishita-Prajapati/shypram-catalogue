import { AdminHeader } from "@/components/admin-header"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we prepare your data</p>
          </div>
        </div>
      </div>
    </div>
  )
}
