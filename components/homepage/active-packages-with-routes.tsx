"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Clock, ArrowRight } from "lucide-react"

// Dynamically import the RouteMap component to avoid SSR issues
const RouteMap = dynamic(
  () => import("@/components/maps/route-map").then((mod) => mod.RouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface PackageWithRoute {
  id: string
  tracking_number: string
  sender_name?: string
  recipient_name?: string
  status: string
  package_type?: string
  created_at: string
  route: {
    id: string
    name: string
    origin: string
    destination: string
    estimated_duration_hours?: number
    origin_lat?: number
    origin_lng?: number
    destination_lat?: number
    destination_lng?: number
    waypoints?: any[]
    color?: string
  } | null
}

export function ActivePackagesWithRoutes() {
  const [packages, setPackages] = useState<PackageWithRoute[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<PackageWithRoute | null>(null)

  useEffect(() => {
    fetchPackagesWithRoutes()
  }, [])

  const fetchPackagesWithRoutes = async () => {
    try {
      const response = await fetch("/api/public/packages-with-routes")
      if (response.ok) {
        const data = await response.json()
        setPackages(data.data || [])
        if (data.data && data.data.length > 0) {
          setSelectedPackage(data.data[0]) // Select first package by default
        }
      }
    } catch (error) {
      console.error("Failed to fetch packages with routes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_transit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading active packages...</p>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Routes</h3>
        <p className="text-gray-600">There are currently no packages with active routes being tracked.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Package Routes</h2>
        <p className="text-gray-600">Track packages currently in transit with live route visualization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Packages in Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                    selectedPackage?.id === pkg.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {pkg.tracking_number}
                    </span>
                    <Badge className={getStatusColor(pkg.status)}>
                      {pkg.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {pkg.route && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{pkg.route.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{pkg.route.origin}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{pkg.route.destination}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{pkg.package_type || "Package"}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(pkg.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPackage?.route ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Tracking: {selectedPackage.tracking_number}</p>
                  <p>Route: {selectedPackage.route.name}</p>
                </div>
                <div className="h-64">
                  <RouteMap
                    routes={[{
                      id: selectedPackage.route.id,
                      name: selectedPackage.route.name,
                      origin: selectedPackage.route.origin,
                      destination: selectedPackage.route.destination,
                      origin_lat: selectedPackage.route.origin_lat || 0,
                      origin_lng: selectedPackage.route.origin_lng || 0,
                      destination_lat: selectedPackage.route.destination_lat || 0,
                      destination_lng: selectedPackage.route.destination_lng || 0,
                      waypoints: selectedPackage.route.waypoints,
                      color: selectedPackage.route.color || "#3B82F6",
                      estimated_duration_hours: selectedPackage.route.estimated_duration_hours
                    }]}
                    className="w-full h-full rounded-lg border"
                  />
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a package to view its route</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
