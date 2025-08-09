"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Route, TrendingUp, Users, Activity, AlertCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GradientCard } from "@/components/ui/gradient-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Package as PackageType, Route as RouteType, TrackingUpdate } from "@/lib/types"

interface DashboardStats {
  totalPackages: number
  activeRoutes: number
  inTransitPackages: number
  deliveredToday: number
  totalUsers: number
  updatesThisWeek: number
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    activeRoutes: 0,
    inTransitPackages: 0,
    deliveredToday: 0,
    totalUsers: 0,
    updatesThisWeek: 0,
  })
  const [recentPackages, setRecentPackages] = useState<PackageType[]>([])
  const [recentUpdates, setRecentUpdates] = useState<TrackingUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch all data in parallel
      const [packagesRes, routesRes, usersRes, trackingRes] = await Promise.all([
        fetch("/api/admin/packages?limit=100", { cache: "no-store" }),
        fetch("/api/admin/routes", { cache: "no-store" }),
        fetch("/api/admin/users?limit=100", { cache: "no-store" }),
        fetch("/api/admin/tracking", { cache: "no-store" }),
      ])

      const [packagesData, routesData, usersData, trackingData] = await Promise.all([
        packagesRes.json(),
        routesRes.json(),
        usersRes.json(),
        trackingRes.json(),
      ])

      if (!packagesRes.ok) throw new Error(packagesData.error || "Failed to fetch packages")
      if (!routesRes.ok) throw new Error(routesData.error || "Failed to fetch routes")
      if (!usersRes.ok) throw new Error(usersData.error || "Failed to fetch users")
      if (!trackingRes.ok) throw new Error(trackingData.error || "Failed to fetch tracking")

      const packages: PackageType[] = packagesData.data || []
      const routes: RouteType[] = routesData.data || []
      const users = usersData.data || []
      const tracking: TrackingUpdate[] = trackingData.data || []

      // Calculate stats
      const today = new Date().toDateString()
      const thisWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const newStats: DashboardStats = {
        totalPackages: packages.length,
        activeRoutes: routes.length,
        inTransitPackages: packages.filter(p => p.status === "in_transit").length,
        deliveredToday: packages.filter(p =>
          p.status === "delivered" &&
          new Date(p.updated_at).toDateString() === today
        ).length,
        totalUsers: users.length,
        updatesThisWeek: tracking.filter(t =>
          new Date(t.timestamp) >= thisWeekStart
        ).length,
      }

      setStats(newStats)
      setRecentPackages(packages.slice(0, 5)) // Show 5 most recent
      setRecentUpdates(tracking.slice(0, 5)) // Show 5 most recent updates

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const statCards = [
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      description: "Packages in the system",
      href: "/admin/packages",
      gradient: "blue" as const,
    },
    {
      title: "Active Routes",
      value: stats.activeRoutes,
      icon: Route,
      description: "Available shipping routes",
      href: "/admin/routes",
      gradient: "green" as const,
    },
    {
      title: "In Transit",
      value: stats.inTransitPackages,
      icon: TrendingUp,
      description: "Packages currently shipping",
      href: "/admin/tracking",
      gradient: "purple" as const,
    },
    {
      title: "Delivered Today",
      value: stats.deliveredToday,
      icon: Activity,
      description: "Packages delivered today",
      href: "/admin/tracking",
      gradient: "orange" as const,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      href: "/admin/users",
      gradient: "blue" as const,
    },
    {
      title: "Updates This Week",
      value: stats.updatesThisWeek,
      icon: AlertCircle,
      description: "Tracking updates",
      href: "/admin/tracking",
      gradient: "green" as const,
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wayfinder Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wayfinder Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Comprehensive overview of your package tracking platform</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="bg-transparent">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <GradientCard
              gradient={stat.gradient}
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 group-hover:text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-slate-500 group-hover:text-slate-600" />
              </div>
              <p className="text-xs text-slate-500 group-hover:text-slate-600">
                {stat.description}
              </p>
            </GradientCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Packages */}
        <GradientCard gradient="blue" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Packages
              </span>
              <Button asChild variant="outline" size="sm" className="bg-transparent">
                <Link href="/admin/packages">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>Latest packages added to the system</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {recentPackages.length > 0 ? (
                recentPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{pkg.tracking_number}</p>
                      <p className="text-xs text-slate-600">
                        {pkg.sender_name} → {pkg.recipient_name}
                      </p>
                      <p className="text-xs text-slate-500">{pkg.package_type}</p>
                    </div>
                    <Badge className={getStatusColor(pkg.status)}>
                      {pkg.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No packages found</p>
              )}
            </div>
          </CardContent>
        </GradientCard>

        {/* Recent Tracking Updates */}
        <GradientCard gradient="green" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Updates
              </span>
              <Button asChild variant="outline" size="sm" className="bg-transparent">
                <Link href="/admin/tracking">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>Latest tracking updates and activities</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{update.location}</p>
                      <p className="text-xs text-slate-600">{update.status}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
                      {update.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {update.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No updates found</p>
              )}
            </div>
          </CardContent>
        </GradientCard>
      </div>

      {/* Quick Actions */}
      <GradientCard gradient="purple" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="bg-transparent h-auto flex-col py-4">
              <Link href="/admin/packages">
                <Package className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Packages</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent h-auto flex-col py-4">
              <Link href="/admin/routes">
                <Route className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Routes</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent h-auto flex-col py-4">
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent h-auto flex-col py-4">
              <Link href="/admin/settings">
                <Activity className="h-6 w-6 mb-2" />
                <span className="text-sm">System Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </GradientCard>
    </div>
  )
}
