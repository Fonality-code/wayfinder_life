"use client"

import { useState, useEffect } from "react"
// Removed createClient and Supabase usage
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Map, MapPin, Palette, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { RouteMap } from "@/components/maps/route-map"
import { GradientCard } from "@/components/ui/gradient-card"
import type { Route } from "@/lib/types"
import { Package } from "lucide-react"

const colorOptions = [
  { name: "Blue", value: "#3B82F6", class: "bg-blue-500" },
  { name: "Red", value: "#EF4444", class: "bg-red-500" },
  { name: "Green", value: "#10B981", class: "bg-green-500" },
  { name: "Purple", value: "#8B5CF6", class: "bg-purple-500" },
  { name: "Orange", value: "#F59E0B", class: "bg-orange-500" },
  { name: "Pink", value: "#EC4899", class: "bg-pink-500" },
] as const

// Sample coordinates for major cities
const cityCoordinates = {
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "Portland, OR": { lat: 45.5152, lng: -122.6784 },
  "London, UK": { lat: 51.5074, lng: -0.1278 },
} as const

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [selectedColor, setSelectedColor] = useState("#3B82F6")
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/routes", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to fetch routes")
      setRoutes(json.data || [])
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to fetch routes", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const autoFillCoordinates = (origin: string, destination: string) => {
    const originCoords = (cityCoordinates as any)[origin]
    const destCoords = (cityCoordinates as any)[destination]

    return {
      origin_lat: originCoords?.lat || null,
      origin_lng: originCoords?.lng || null,
      destination_lat: destCoords?.lat || null,
      destination_lng: destCoords?.lng || null,
    }
  }

  const handleSubmit = async (formData: FormData) => {
    const origin = formData.get("origin") as string
    const destination = formData.get("destination") as string

    const coords = autoFillCoordinates(origin, destination)

    const routeData = {
      name: formData.get("name") as string,
      origin,
      destination,
      estimated_duration_hours:
        (formData.get("estimated_duration_hours") as string)?.length
          ? Number.parseInt(formData.get("estimated_duration_hours") as string)
          : null,
      origin_lat: (formData.get("origin_lat") as string)?.length
        ? Number.parseFloat(formData.get("origin_lat") as string)
        : (coords.origin_lat as number | null),
      origin_lng: (formData.get("origin_lng") as string)?.length
        ? Number.parseFloat(formData.get("origin_lng") as string)
        : (coords.origin_lng as number | null),
      destination_lat: (formData.get("destination_lat") as string)?.length
        ? Number.parseFloat(formData.get("destination_lat") as string)
        : (coords.destination_lat as number | null),
      destination_lng: (formData.get("destination_lng") as string)?.length
        ? Number.parseFloat(formData.get("destination_lng") as string)
        : (coords.destination_lng as number | null),
      color: selectedColor,
    }

    try {
      let res: Response
      if (editingRoute) {
        res = await fetch(`/api/admin/routes/${editingRoute.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routeData),
        })
      } else {
        res = await fetch(`/api/admin/routes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routeData),
        })
      }

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save route")

      toast({ title: "Success", description: `Route ${editingRoute ? "updated" : "created"} successfully` })
      setIsDialogOpen(false)
      setEditingRoute(null)
      setSelectedColor("#3B82F6")
      fetchRoutes()
      setMapKey((prev) => prev + 1)
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Save failed", variant: "destructive" })
    }
  }

  const openEditDialog = (route: Route) => {
    setEditingRoute(route)
    setSelectedColor(route.color || "#3B82F6")
    setIsDialogOpen(true)
  }

  const refreshMap = () => {
    setMapKey((prev) => prev + 1)
    toast({ title: "Map Refreshed", description: "The map has been reloaded with the latest data" })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wayfinder Routes
          </h1>
          <p className="text-slate-600 mt-2">Manage shipping routes with geolocation and visual mapping</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={refreshMap} className="bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Map
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRoute(null)
                  setSelectedColor("#3B82F6")
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {editingRoute ? "Edit Route" : "Create New Route"}
                </DialogTitle>
                <DialogDescription>
                  {editingRoute
                    ? "Update route information and geolocation"
                    : "Create a new shipping route with optional geolocation"}
                </DialogDescription>
              </DialogHeader>
              <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Route Name *</Label>
                    <Input id="name" name="name" defaultValue={editingRoute?.name} placeholder="e.g., Express Route NYC-LA" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin *</Label>
                    <Input id="origin" name="origin" defaultValue={editingRoute?.origin} placeholder="e.g., New York, NY" required />
                    <p className="text-xs text-slate-500">Coordinates will be auto-filled for major cities</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input id="destination" name="destination" defaultValue={editingRoute?.destination} placeholder="e.g., Los Angeles, CA" required />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Geolocation (Optional - Auto-filled for major cities)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin_lat" className="text-sm">Origin Latitude</Label>
                      <Input id="origin_lat" name="origin_lat" type="number" step="any" defaultValue={editingRoute?.origin_lat ?? undefined} placeholder="40.7128" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin_lng" className="text-sm">Origin Longitude</Label>
                      <Input id="origin_lng" name="origin_lng" type="number" step="any" defaultValue={editingRoute?.origin_lng ?? undefined} placeholder="-74.0060" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination_lat" className="text-sm">Destination Latitude</Label>
                      <Input id="destination_lat" name="destination_lat" type="number" step="any" defaultValue={editingRoute?.destination_lat ?? undefined} placeholder="34.0522" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination_lng" className="text-sm">Destination Longitude</Label>
                      <Input id="destination_lng" name="destination_lng" type="number" step="any" defaultValue={editingRoute?.destination_lng ?? undefined} placeholder="-118.2437" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimated_duration_hours">Duration (hours)</Label>
                    <Input id="estimated_duration_hours" name="estimated_duration_hours" type="number" defaultValue={editingRoute?.estimated_duration_hours ?? undefined} placeholder="48" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Palette className="h-4 w-4" />Route Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${color.class} ${selectedColor === color.value ? "border-slate-900 scale-110" : "border-slate-300"}`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {editingRoute ? "Update Route" : "Create Route"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Routes List
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Map View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <GradientCard gradient="blue" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                All Routes
              </CardTitle>
              <CardDescription>{routes.length} routes configured</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Origin → Destination</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Geolocation</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {routes.map((route) => (
                        <TableRow key={route.id} className="hover:bg-white/50">
                          <TableCell className="font-medium">{route.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{route.origin}</span>
                              <span className="text-slate-400">→</span>
                              <span>{route.destination}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {route.estimated_duration_hours ? (
                              <Badge variant="secondary">{route.estimated_duration_hours}h</Badge>
                            ) : (
                              <span className="text-slate-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {route.origin_lat && route.origin_lng ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <MapPin className="h-3 w-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-slate-50 text-slate-500">Disabled</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: route.color || "#3B82F6" }} />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(route)} className="hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRoute(route)} className="hover:bg-green-50">
                                <Map className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </GradientCard>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <GradientCard gradient="green" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Route Visualization
              </CardTitle>
              <CardDescription>
                Interactive map showing all routes with geolocation data
                {selectedRoute && ` - Highlighting: ${selectedRoute.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <RouteMap key={mapKey} routes={routes.filter((r) => r.origin_lat && r.origin_lng)} selectedRoute={selectedRoute} className="border border-slate-200 shadow-sm" />
              {selectedRoute && (
                <div className="mt-4 p-4 bg-white/50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold mb-2">Selected Route: {selectedRoute.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Origin:</span> {selectedRoute.origin}
                    </div>
                    <div>
                      <span className="text-slate-600">Destination:</span> {selectedRoute.destination}
                    </div>
                    {selectedRoute.origin_lat && selectedRoute.origin_lng && (
                      <div className="col-span-2">
                        <span className="text-slate-600">Coordinates:</span> {selectedRoute.origin_lat.toFixed(4)}, {selectedRoute.origin_lng.toFixed(4)} → {selectedRoute.destination_lat?.toFixed(4)}, {selectedRoute.destination_lng?.toFixed(4)}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedRoute(null)} className="mt-3">
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </GradientCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
