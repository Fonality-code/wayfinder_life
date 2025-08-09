"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Package,
  Truck,
  MapPin,
  Inbox,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { StatusBadge, type PackageStatus } from "@/components/ui/status-badge"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
}

interface PackageItem {
  id: string
  tracking_number: string
  carrier: string
  sender_name: string
  recipient_name: string
  status: PackageStatus
  origin: string
  destination: string
  current_location: string
  estimated_delivery: string | null
  created_at: string
  updated_at: string
}

interface TrackingUpdate {
  id: string
  status: string
  location: string
  timestamp: string
  description: string
  created_at: string
}

interface DashboardStats {
  total: number
  inTransit: number
  delivered: number
  exceptions: number
  deliveredToday: number
  updatesThisWeek: number
}

interface Props {
  user: User
  role: string
  initialPackages: PackageItem[]
}

function StatCard({ title, value, description, icon, color }: {
  title: string
  value: number
  description?: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-full", color)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ onAddPackage }: { onAddPackage: () => void }) {
  return (
    <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No packages yet</h3>
        <p className="text-slate-600 text-center mb-6 max-w-sm">
          Start tracking your packages by adding a tracking number below.
        </p>
        <Button onClick={onAddPackage} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Package
        </Button>
      </CardContent>
    </Card>
  )
}

export default function EnhancedDashboardClient({ user, role, initialPackages }: Props) {
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages)
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    exceptions: 0,
    deliveredToday: 0,
    updatesThisWeek: 0,
  })
  const [recentUpdates, setRecentUpdates] = useState<TrackingUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newTracking, setNewTracking] = useState("")
  const [newCarrier, setNewCarrier] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      const [packagesRes, statsRes] = await Promise.all([
        fetch("/api/packages?pageSize=100", { cache: "no-store" }),
        fetch("/api/packages/stats", { cache: "no-store" })
      ])

      const [packagesData, statsData] = await Promise.all([
        packagesRes.json(),
        statsRes.json()
      ])

      if (packagesRes.ok && packagesData.data) {
        setPackages(packagesData.data)
      }

      if (statsRes.ok) {
        setStats(statsData.stats || {})
        setRecentUpdates(statsData.recentUpdates || [])
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPackage = async () => {
    if (!newTracking.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAdding(true)
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_number: newTracking.trim(),
          carrier: newCarrier.trim() || "Unknown"
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Package added successfully",
        })
        setAddDialogOpen(false)
        setNewTracking("")
        setNewCarrier("")
        fetchDashboardData() // Refresh data
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add package",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add package:", error)
      toast({
        title: "Error",
        description: "Failed to add package. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = searchQuery === "" ||
      pkg.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === "all" ||
      (activeTab === "active" && ["shipped", "in_transit", "out_for_delivery"].includes(pkg.status)) ||
      (activeTab === "delivered" && pkg.status === "delivered") ||
      (activeTab === "exceptions" && ["exception", "failed_delivery", "returned"].includes(pkg.status))

    return matchesSearch && matchesTab
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
          <div>
            <div className="h-6 bg-slate-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse mt-1" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back{user.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-slate-600">Track and manage your packages</p>
          </div>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Package</DialogTitle>
              <DialogDescription>
                Enter the tracking number for a package you&apos;re expecting.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tracking Number</label>
                <Input
                  placeholder="e.g., 1Z999AA10123456784"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Carrier (optional)</label>
                <Input
                  placeholder="e.g., UPS, FedEx, DHL"
                  value={newCarrier}
                  onChange={(e) => setNewCarrier(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  disabled={isAdding}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPackage} disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add Package"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Packages"
          value={stats.total}
          description="All your packages"
          icon={<Inbox className="h-5 w-5 text-slate-600" />}
          color="bg-slate-100"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          description="Currently shipping"
          icon={<Truck className="h-5 w-5 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          description="Successfully delivered"
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Issues"
          value={stats.exceptions}
          description="Require attention"
          icon={<AlertCircle className="h-5 w-5 text-red-600" />}
          color="bg-red-100"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search packages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={fetchDashboardData}
          variant="outline"
          className="shrink-0"
        >
          Refresh
        </Button>
      </div>

      {/* Package List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.inTransit})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({stats.delivered})</TabsTrigger>
          <TabsTrigger value="exceptions">Issues ({stats.exceptions})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredPackages.length === 0 ? (
            packages.length === 0 ? (
              <EmptyState onAddPackage={() => setAddDialogOpen(true)} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-8 w-8 text-slate-400 mb-3" />
                  <p className="text-slate-600">No packages match your filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setActiveTab("all")
                    }}
                    className="mt-3"
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )
          ) : (
            <div className="grid gap-4">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium bg-slate-100 px-2 py-1 rounded">
                            {pkg.tracking_number}
                          </span>
                          <Badge variant="outline">{pkg.carrier}</Badge>
                          <StatusBadge status={pkg.status} />
                        </div>
                        <div className="text-sm text-slate-600">
                          <p><span className="font-medium">From:</span> {pkg.sender_name}</p>
                          <p><span className="font-medium">To:</span> {pkg.destination}</p>
                          {pkg.current_location && (
                            <p><span className="font-medium">Current:</span> {pkg.current_location}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {pkg.estimated_delivery && (
                          <div className="text-right">
                            <p className="font-medium">Est. Delivery</p>
                            <p>{new Date(pkg.estimated_delivery).toLocaleDateString()}</p>
                          </div>
                        )}
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Updates
            </CardTitle>
            <CardDescription>Latest tracking updates for your packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{update.status}</p>
                    <p className="text-xs text-slate-600">{update.location}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(update.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
