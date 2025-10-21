"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const generateElements = () => {
      const newElements: FloatingElement[] = []
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 60 + 20,
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        })
      }
      setElements(newElements)
    }

    generateElements()
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"
  const gradientColors = isDark ? "from-blue-500/20 to-purple-500/20" : "from-orange-400/20 to-pink-400/20"
  const borderColors = isDark
    ? { primary: "border-blue-500/20", secondary: "border-purple-500/20" }
    : { primary: "border-orange-400/20", secondary: "border-pink-400/20" }
  const bgGradient = isDark ? "from-cyan-500/10 to-blue-500/10" : "from-yellow-400/10 to-orange-400/10"

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute rounded-full bg-gradient-to-br ${gradientColors} blur-sm animate-float`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            opacity: element.opacity,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}

      <div
        className={`absolute top-20 left-10 w-32 h-32 border ${borderColors.primary} rounded-full animate-spin-slow`}
      />
      <div
        className={`absolute bottom-32 right-20 w-24 h-24 border ${borderColors.secondary} rotate-45 animate-pulse`}
      />
      <div
        className={`absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r ${bgGradient} rounded-lg animate-bounce-slow`}
      />
    </div>
  )
}
