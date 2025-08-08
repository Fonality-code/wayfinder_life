import type React from "react"
import { cn } from "@/lib/utils"

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "gradient" | "solid" | "outline" | "glow"
  size?: "sm" | "md" | "lg" | "xl"
  interactive?: boolean
  children: React.ReactNode
}

const cardVariants = {
  glass: "glass-card shadow-premium",
  gradient: "bg-gradient-to-br from-white via-blue-50 to-purple-50 border border-white/60 shadow-premium",
  solid: "bg-white border border-gray-200 shadow-xl",
  outline: "bg-transparent border-2 border-gradient-to-r from-blue-500 to-purple-500",
  glow: "bg-white border border-blue-200 shadow-glow",
}

const cardSizes = {
  sm: "p-4 rounded-lg",
  md: "p-6 rounded-xl",
  lg: "p-8 rounded-2xl",
  xl: "p-10 rounded-3xl",
}

export function PremiumCard({
  variant = "glass",
  size = "md",
  interactive = false,
  className,
  children,
  ...props
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        cardVariants[variant],
        cardSizes[size],
        interactive && "hover-lift hover-glow cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
