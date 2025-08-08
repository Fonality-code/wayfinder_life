"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface DesktopNavProps {
  currentPath?: string
}

export function DesktopNav({ currentPath }: DesktopNavProps) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Help", href: "/help" },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-blue-600 relative",
            currentPath === item.href
              ? "text-blue-600 after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:rounded-full"
              : "text-gray-700",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
