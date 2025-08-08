"use client"

import { useState } from "react"
import { Menu, X, Package, Home, Info, DollarSign, Phone, HelpCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath = "/" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/help", label: "Help", icon: HelpCircle },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className="p-2 hover:bg-blue-50"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMenu} aria-hidden="true" />}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wayfinder
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 hover:bg-white/50"
              aria-label="Close mobile menu"
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6 bg-white">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium ${
                      currentPath === item.href ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <Link href="/auth" onClick={toggleMenu}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
