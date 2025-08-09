"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Route, TrendingUp, Users, Activity, AlertCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GradientCard } from "@/components/ui/gradient-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Package as PackageType, TrackingUpdate } from "@/lib/types"

interface DashboardStats {
  totalPackages: number
  activeRoutes: number
  inTransitPackages: number
  deliveredToday: number
  totalUsers: number
  updatesThisWeek: number
}

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface Route {
  id: string
  name: string
  origin: string
  destination: string
}

function AdminDashboardClient() {
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

      // Parse responses
      const [packagesData, routesData, usersData, trackingData] = await Promise.all([
        packagesRes.json().catch(() => ({ error: "Failed to parse packages response", data: [] })),
        routesRes.json().catch(() => ({ error: "Failed to parse routes response", data: [] })),
        usersRes.json().catch(() => ({ error: "Failed to parse users response", data: [] })),
        trackingRes.json().catch(() => ({ error: "Failed to parse tracking response", data: [] })),
      ])

      // Check for errors and log them
      if (!packagesRes.ok) {
        console.error("Packages API error:", packagesData.error || "Unknown error")
        throw new Error(packagesData.error || "Failed to fetch packages")
      }
      if (!routesRes.ok) {
        console.error("Routes API error:", routesData.error || "Unknown error")
        throw new Error(routesData.error || "Failed to fetch routes")
      }
      if (!usersRes.ok) {
        console.error("Users API error:", usersData.error || "Unknown error")
        throw new Error(usersData.error || "Failed to fetch users")
      }
      if (!trackingRes.ok) {
        console.error("Tracking API error:", trackingData.error || "Unknown error")
        throw new Error(trackingData.error || "Failed to fetch tracking")
      }

      const packages = packagesData.data || []
      const routes = routesData.data || []
      const users = usersData.data || []
      const tracking = trackingData.data || []

      console.log("Dashboard data fetched:", { packages: packages.length, routes: routes.length, users: users.length, tracking: tracking.length })

      // Calculate stats
      const today = new Date().toDateString()
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const calculatedStats = {
        totalPackages: packages.length,
        activeRoutes: routes.length,
        inTransitPackages: packages.filter((p: PackageType) => p.status === "in_transit").length,
        deliveredToday: packages.filter((p: PackageType) => {
          try {
            return p.status === "delivered" && p.updated_at && new Date(p.updated_at).toDateString() === today
          } catch (e) {
            console.warn("Error parsing updated_at for package:", p.id, p.updated_at)
            return false
          }
        }).length,
        totalUsers: users.length,
        updatesThisWeek: tracking.filter((t: TrackingUpdate) => {
          try {
            return new Date(t.timestamp) > weekAgo
          } catch (e) {
            console.warn("Error parsing timestamp for tracking update:", t.id, t.timestamp)
            return false
          }
        }).length,
      }

      setStats(calculatedStats)
      setRecentPackages(packages.slice(0, 5))
      setRecentUpdates(tracking.slice(0, 5))

    } catch (error: any) {
      console.error("Dashboard fetch error:", error)
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
    switch (status.toLowerCase()) {
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Welcome to the Wayfinder admin dashboard. Monitor your platform's performance and manage operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GradientCard gradient="blue" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Packages</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalPackages}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="green" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Routes</p>
              <p className="text-2xl font-bold text-slate-900">{stats.activeRoutes}</p>
            </div>
            <Route className="h-8 w-8 text-green-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="purple" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Transit</p>
              <p className="text-2xl font-bold text-slate-900">{stats.inTransitPackages}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="orange" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Delivered Today</p>
              <p className="text-2xl font-bold text-slate-900">{stats.deliveredToday}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="pink" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-pink-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="blue" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Updates This Week</p>
              <p className="text-2xl font-bold text-slate-900">{stats.updatesThisWeek}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-cyan-600" />
          </div>
        </GradientCard>
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
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/packages">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>Latest package activity</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {recentPackages.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No packages yet</p>
              ) : (
                recentPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div>
                      <p className="font-medium">{pkg.tracking_number}</p>
                      <p className="text-sm text-slate-600">{pkg.sender_name} → {pkg.recipient_name}</p>
                    </div>
                    <Badge className={getStatusColor(pkg.status)}>
                      {pkg.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </GradientCard>

        {/* Recent Updates */}
        <GradientCard gradient="green" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Tracking Updates
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/tracking">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>Latest tracking activity</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {recentUpdates.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No tracking updates yet</p>
              ) : (
                recentUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{update.location}</p>
                      <p className="text-sm text-slate-600">{update.status}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </GradientCard>
      </div>

      {/* Quick Actions */}
      <GradientCard gradient="purple" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks and management tools</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/packages">
                <Package className="h-6 w-6" />
                Manage Packages
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/routes">
                <Route className="h-6 w-6" />
                Manage Routes
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/users">
                <Users className="h-6 w-6" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/settings">
                <AlertCircle className="h-6 w-6" />
                System Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </GradientCard>
    </div>
  )
}

export default AdminDashboardClient
