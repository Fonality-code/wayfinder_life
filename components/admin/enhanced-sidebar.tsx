"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, MapPin, Users, Bell, Settings, LogOut, User, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Packages",
    href: "/admin/packages",
    icon: Package,
    badge: "12",
  },
  {
    title: "Tracking",
    href: "/admin/tracking",
    icon: MapPin,
  },
  {
    title: "Routes",
    href: "/admin/routes",
    icon: Route,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    badge: "3",
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    badge: "5",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function EnhancedSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex h-16 items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge
                  variant={isActive ? "secondary" : "default"}
                  className={`ml-auto ${isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4">
        <div className="mb-4 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@wayfinder.com</p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
