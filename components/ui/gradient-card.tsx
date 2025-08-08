import type React from "react"
import { cn } from "@/lib/utils"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "blue" | "purple" | "green" | "orange" | "pink"
  children: React.ReactNode
}

const gradients = {
  blue: "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200",
  purple: "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200",
  green: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
  orange: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200",
  pink: "bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200",
}

export function GradientCard({ gradient = "blue", className, children, ...props }: GradientCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        gradients[gradient],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
