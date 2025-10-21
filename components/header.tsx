"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Menu, X, User, ShoppingCart } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"
import { useUserAuthStore } from "@/lib/user-auth-store"
import { AuthModal } from "@/components/auth-modal"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCartStore()
  const { isAuthenticated } = useUserAuthStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? getTotalItems() : 0



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (query) {
      setIsMenuOpen(false) // Close mobile menu if open
      router.push(`/catalogue?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full glass-nav border-b border-primary/20 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo + Company Name */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <Logo width={40} height={40} />
              </Link>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-blue-600">
                  Shypram Rubber
                </h1>
              </div>
            </div>

            {/* Center Section: Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
              <Button type="submit" size="sm" className="magnetic hover-glow">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Right Section: Navigation + Actions */}
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary hover:shadow-[0_0_15px_rgba(243,188,39,0.4)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.4)] transition-all duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary hover:shadow-[0_0_15px_rgba(243,188,39,0.4)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.4)] transition-all duration-300"
                >
                  About
                </Link>
                <Link
                  href="/catalogue"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary hover:shadow-[0_0_15px_rgba(243,188,39,0.4)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.4)] transition-all duration-300"
                >
                  Products
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary hover:shadow-[0_0_15px_rgba(243,188,39,0.4)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.4)] transition-all duration-300"
                >
                  Contact
                </Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                
                {/* Cart */}
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-foreground/80 hover:text-accent hover:bg-accent/10 magnetic"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs flex items-center justify-center animate-heartbeat">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                    <span className="sr-only">Shopping cart</span>
                  </Button>
                </Link>
                


                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-foreground/80 hover:text-accent hover:bg-accent/10"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-primary/20 py-4 animate-fade-in glass-nav">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(243,188,39,0.3)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(243,188,39,0.3)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/catalogue"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(243,188,39,0.3)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(243,188,39,0.3)] dark:hover:shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex gap-2 px-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <Button type="submit" size="sm" className="magnetic hover-glow">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </nav>
            </div>
          )}
        </div>
      </header>


    </>
  )
}
