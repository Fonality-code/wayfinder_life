"use client"

import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import Link from "next/link"

interface MainHeaderProps {
  currentPath?: string
}

export function MainHeader({ currentPath = "/" }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wayfinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                currentPath === "/about" ? "text-blue-600" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                currentPath === "/pricing" ? "text-blue-600" : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                currentPath === "/contact" ? "text-blue-600" : ""
              }`}
            >
              Contact
            </Link>
            <Link
              href="/help"
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                currentPath === "/help" ? "text-blue-600" : ""
              }`}
            >
              Help
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6">
                Sign In
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <MobileNav currentPath={currentPath} />
        </div>
      </div>
    </header>
  )
}
