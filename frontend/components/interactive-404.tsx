'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Home, Search, ArrowLeft, RefreshCw, Zap, Star } from 'lucide-react'

interface Interactive404Props {
  title?: string
  description?: string
  showSearch?: boolean
}

export default function Interactive404({ 
  title = "Oops! Page Not Found",
  description = "The page you're looking for seems to have wandered off. Don't worry, even our best rubber gaskets sometimes slip away!",
  showSearch = true
}: Interactive404Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([])
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const createParticle = useCallback((x: number, y: number) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
    
    setParticles(prev => [...prev, newParticle])
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id))
    }, 1000)
  }, [])

  const handleNumberClick = (e: React.MouseEvent) => {
    setClickCount(prev => prev + 1)
    createParticle(e.clientX, e.clientY)
    
    if (clickCount + 1 === 10) {
      setShowEasterEgg(true)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const getRandomColor = () => {
    const colors = ['text-blue-500', 'text-purple-500', 'text-pink-500', 'text-green-500', 'text-yellow-500', 'text-red-500']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight']
  const [konamiIndex, setKonamiIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konami[konamiIndex]) {
        setKonamiIndex(prev => prev + 1)
        if (konamiIndex === konami.length - 1) {
          setShowEasterEgg(true)
          setKonamiIndex(0)
        }
      } else {
        setKonamiIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiIndex, konami])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary/20 rounded-full animate-float-reverse" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/15 rounded-full animate-bounce-slow" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-muted/30 rounded-full animate-pulse-glow" />
      </div>

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed w-2 h-2 rounded-full pointer-events-none z-30 animate-ping"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
          }}
        />
      ))}

      {/* Mouse follower */}
      <div 
        className="fixed w-4 h-4 bg-primary/30 rounded-full pointer-events-none z-10 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: isHovering ? 'scale(2)' : 'scale(1)',
        }}
      />

      <div className="text-center z-20 relative max-w-2xl mx-auto px-6">
        {/* Interactive 404 */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span 
              className={`text-8xl md:text-9xl font-bold cursor-pointer transition-all duration-300 hover:scale-110 select-none ${
                clickCount > 0 ? getRandomColor() : 'text-primary'
              }`}
              onClick={handleNumberClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              4
            </span>
            <div className="relative">
              <span 
                className={`text-8xl md:text-9xl font-bold cursor-pointer transition-all duration-500 hover:rotate-12 select-none ${
                  clickCount > 1 ? getRandomColor() : 'text-primary'
                }`}
                onClick={handleNumberClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                0
              </span>
              {clickCount > 2 && (
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="w-full h-full border-4 border-primary/30 rounded-full" />
                </div>
              )}
            </div>
            <span 
              className={`text-8xl md:text-9xl font-bold cursor-pointer transition-all duration-300 hover:scale-110 hover:-rotate-6 select-none ${
                clickCount > 3 ? getRandomColor() : 'text-primary'
              }`}
              onClick={handleNumberClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              4
            </span>
          </div>
          
          {clickCount > 0 && (
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <Star className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                {clickCount} click{clickCount !== 1 ? 's' : ''}! Keep exploring!
              </p>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {description}
          </p>

          {/* Search functionality */}
          {showSearch && (
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onFocus={() => setIsHovering(true)}
                  onBlur={() => setIsHovering(false)}
                />
                <Button 
                  type="submit"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Interactive buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              asChild 
              size="lg"
              className="group transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Go Home
              </Link>
            </Button>

            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="group transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Link href="/catalogue">
                <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Browse Catalogue
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => window.history.back()}
              className="group transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </div>

          {/* Fun interactive element */}
          <div className="pt-8">
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="group text-muted-foreground hover:text-foreground transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              Try refreshing the page
            </Button>
          </div>
        </div>

        {/* Easter eggs */}
        {clickCount > 5 && !showEasterEgg && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-pulse-glow">
            <p className="text-sm text-primary font-medium">
              🎊 Wow! You're persistent! Here's a secret: Our rubber gaskets are as reliable as your clicking skills!
            </p>
          </div>
        )}

        {showEasterEgg && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 animate-pulse-glow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />
              <h3 className="text-lg font-bold text-foreground">🎉 Easter Egg Unlocked! 🎉</h3>
              <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You've discovered our secret! You're now officially a Shypram Explorer! 🚀
            </p>
            <div className="text-xs text-muted-foreground">
              <p>💡 Pro tip: Try the Konami code (↑↑↓↓←→←→) for more surprises!</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-float select-none">
        🔍
      </div>
      <div className="absolute top-3/4 right-10 text-4xl opacity-20 animate-float-reverse select-none">
        🏠
      </div>
      <div className="absolute bottom-1/4 left-1/3 text-5xl opacity-20 animate-bounce-slow select-none">
        ⚙️
      </div>
      
      {showEasterEgg && (
        <>
          <div className="absolute top-10 right-1/4 text-3xl opacity-30 animate-spin-slow select-none">
            ⭐
          </div>
          <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-bounce-slow select-none">
            🎊
          </div>
        </>
      )}
    </div>
  )
}