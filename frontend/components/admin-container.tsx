import { cn } from "@/lib/utils"

interface AdminContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export function AdminContainer({ 
  children, 
  className,
  maxWidth = "2xl" 
}: AdminContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-7xl",
    full: "max-w-full"
  }

  return (
    <div className={cn(
      "container mx-auto p-4 sm:p-6 space-y-6",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}