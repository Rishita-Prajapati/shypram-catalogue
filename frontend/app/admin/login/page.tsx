"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/lib/admin-store"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Logo } from "@/components/logo"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdminStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <Card className="w-full max-w-md shadow-2xl border-2 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo 
              width={64}
              height={64}
              className="hover:scale-110 transition-all duration-300 shadow-lg rounded-lg"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <p className="text-muted-foreground mt-2">Shypram Rubber Management System</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="admin@shypramrubber.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-xs font-mono bg-background/50 p-2 rounded border">admin@shypramrubber.com</p>
              <p className="text-xs font-mono bg-background/50 p-2 rounded border">admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
    </div>
  )
}
