"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/lib/admin-store"
import { LogOut, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { adminUser, logout } = useAdminStore()
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2 group">
            <Logo width={32} height={32} />
            <div>
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Shypram Rubber</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:scale-105 px-2 py-1">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/admin/products" className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:scale-105 px-2 py-1">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/admin/orders" className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:scale-105 px-2 py-1">
              Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/admin/analytics" className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:scale-105 px-2 py-1">
              Analytics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/admin/settings" className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:scale-105 px-2 py-1">
              Settings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="magnetic hover-glow">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Info & Logout */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Welcome, {adminUser?.name}</span>
              <Button variant="ghost" size="icon" onClick={logout} className="magnetic hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="lg:hidden magnetic" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 animate-fade-in-up bg-background/95 backdrop-blur">
            <nav className="flex flex-col space-y-2 px-2">
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50 active:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50 active:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50 active:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50 active:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/admin/settings"
                className="text-sm font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted/50 active:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="flex items-center justify-between pt-4 mt-2 border-t px-4">
                <span className="text-sm text-muted-foreground truncate">{adminUser?.name}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="hover:text-destructive ml-2 shrink-0">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
