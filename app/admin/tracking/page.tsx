"use client"

import { useState, useEffect } from "react"
// Removed Supabase client usage
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RouteMap } from "@/components/maps/route-map"
import { GradientCard } from "@/components/ui/gradient-card"
import { MapPin, Plus, Package, Clock, Truck, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Package as PackageType, TrackingUpdate, Route } from "@/lib/types"

export default function LiveTrackingPage() {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([])
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [packagesRes, routesRes, updatesRes] = await Promise.all([
        fetch("/api/admin/packages", { cache: "no-store" }),
        fetch("/api/admin/routes", { cache: "no-store" }),
        fetch("/api/admin/tracking", { cache: "no-store" }),
      ])

      const [packagesJson, routesJson, updatesJson] = await Promise.all([
        packagesRes.json(),
        routesRes.json(),
        updatesRes.json(),
      ])

      if (!packagesRes.ok) throw new Error(packagesJson.error || "Failed to fetch packages")
      if (!routesRes.ok) throw new Error(routesJson.error || "Failed to fetch routes")
      if (!updatesRes.ok) throw new Error(updatesJson.error || "Failed to fetch tracking updates")

      setPackages(packagesJson.data || [])
      setRoutes(routesJson.data || [])
      setTrackingUpdates(updatesJson.data || [])
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to load data", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUpdate = async (formData: FormData) => {
    if (!selectedPackage) return

    const updateData = {
      package_id: selectedPackage.id,
      location: formData.get("location") as string,
      status: formData.get("status") as string,
      description: (formData.get("description") as string) || null,
      latitude: (formData.get("latitude") as string)?.length
        ? Number.parseFloat(formData.get("latitude") as string)
        : null,
      longitude: (formData.get("longitude") as string)?.length
        ? Number.parseFloat(formData.get("longitude") as string)
        : null,
    }

    try {
      const res = await fetch("/api/admin/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to add update")

      toast({ title: "Success", description: "Tracking update added successfully" })
      setIsDialogOpen(false)
      // Refresh tracking updates list
      await fetchData()
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to add update", variant: "destructive" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
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

  const activePackages = packages.filter((p) => p.status === "in_transit")
  const selectedPackageUpdates = selectedPackage
    ? trackingUpdates.filter((u) => u.package_id === selectedPackage.id)
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Wayfinder Live Tracking
        </h1>
        <p className="text-slate-600 mt-2">Monitor packages in real-time with interactive maps and location updates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GradientCard gradient="blue" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Packages</p>
              <p className="text-2xl font-bold text-slate-900">{activePackages.length}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="green" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Routes</p>
              <p className="text-2xl font-bold text-slate-900">{routes.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="purple" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Updates Today</p>
              <p className="text-2xl font-bold text-slate-900">
                {
                  trackingUpdates.filter((u) => new Date(u.timestamp).toDateString() === new Date().toDateString())
                    .length
                }
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </GradientCard>

        <GradientCard gradient="orange" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Delivered Today</p>
              <p className="text-2xl font-bold text-slate-900">
                {
                  packages.filter((p) => {
                    try {
                      return p.status === "delivered" && p.updated_at && new Date(p.updated_at).toDateString() === new Date().toDateString()
                    } catch (e) {
                      console.warn("Error parsing updated_at for package:", p.id, p.updated_at)
                      return false
                    }
                  }).length
                }
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </GradientCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Packages */}
        <GradientCard gradient="blue" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Packages
              </span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Update
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Tracking Update</DialogTitle>
                    <DialogDescription>
                      Add a new location update for {selectedPackage?.tracking_number}
                    </DialogDescription>
                  </DialogHeader>
                  <form action={handleAddUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input id="location" name="location" placeholder="e.g., Chicago Distribution Center" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select name="status" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Package received">Package received</SelectItem>
                          <SelectItem value="In transit">In transit</SelectItem>
                          <SelectItem value="Out for delivery">Out for delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Exception">Exception</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Additional details about this update"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude (Optional)</Label>
                        <Input id="latitude" name="latitude" type="number" step="any" placeholder="41.8781" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude (Optional)</Label>
                        <Input id="longitude" name="longitude" type="number" step="any" placeholder="-87.6298" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Update
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>{activePackages.length} packages currently in transit</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "bg-blue-50 border-blue-200 shadow-md"
                      : "bg-white/50 border-slate-200 hover:bg-white/80"
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{pkg.tracking_number}</span>
                    <Badge className={getStatusColor(pkg.status)}>
                      {getStatusIcon(pkg.status)}
                      <span className="ml-1">{pkg.status.replace("_", " ").toUpperCase()}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>
                      {pkg.sender_name} → {pkg.recipient_name}
                    </p>
                    <p className="text-xs mt-1">{pkg.package_type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GradientCard>

        {/* Map View */}
        <GradientCard gradient="green" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Visualization
            </CardTitle>
            <CardDescription>
              {selectedPackage ? `Tracking: ${selectedPackage.tracking_number}` : "Select a package to view its route"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <RouteMap
              routes={routes.filter((r) => r.origin_lat && r.origin_lng)}
              trackingUpdates={selectedPackageUpdates}
              className="border border-slate-200 shadow-sm"
            />
          </CardContent>
        </GradientCard>
      </div>

      {/* Recent Updates */}
      {selectedPackage && (
        <GradientCard gradient="purple" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tracking History - {selectedPackage.tracking_number}
            </CardTitle>
            <CardDescription>{selectedPackageUpdates.length} updates recorded</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {selectedPackageUpdates.map((update, index) => (
                <div key={update.id} className="flex items-start gap-4 p-4 bg-white/50 rounded-lg">
                  <div className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{update.location}</h4>
                      <span className="text-sm text-slate-500">{new Date(update.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{update.status}</p>
                    {update.description && <p className="text-sm text-slate-500">{update.description}</p>}
                    {update.latitude && update.longitude && (
                      <p className="text-xs text-slate-400 mt-2">
                        📍 {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GradientCard>
      )}
    </div>
  )
}
