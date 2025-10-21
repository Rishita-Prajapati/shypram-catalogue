'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-destructive/10 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-destructive/20 rounded-full animate-float-reverse" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-destructive/15 rounded-full animate-bounce-slow" />
      </div>

      <div className="text-center z-20 relative max-w-2xl mx-auto px-6">
        {/* Logo and Error icon */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Logo 
              width={64}
              height={64}
              className="mb-4"
            />
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Something went wrong!
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Don't worry, even the best systems sometimes need a little adjustment. 
            Let's get you back on track!
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-muted rounded-lg text-left max-w-lg mx-auto">
              <h3 className="font-semibold text-sm mb-2">Error Details:</h3>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              onClick={reset}
              size="lg"
              className="group transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>

            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="group transition-all duration-300 hover:scale-105"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-float">
        ⚠️
      </div>
      <div className="absolute bottom-1/4 right-10 text-4xl opacity-20 animate-float-reverse">
        🔧
      </div>
    </div>
  )
}