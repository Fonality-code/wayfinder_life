"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Clock,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { StatusBadge, type PackageStatus } from "@/components/ui/status-badge"
import { toast } from "@/hooks/use-toast"

interface TrackingUpdate {
  id: string
  status: string
  location: string
  timestamp: string
  description: string
}

interface PackageDetails {
  id: string
  tracking_number: string
  carrier: string
  sender_name?: string
  recipient_name?: string
  status: PackageStatus
  origin?: string
  destination: string
  current_location: string
  estimated_delivery: string | null
  created_at: string
  tracking_updates: TrackingUpdate[]
  is_owned?: boolean
}

export default function TrackingClient() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSearching(true)
      setError(null)
      setPackageDetails(null)

      const response = await fetch(`/api/packages/track?tracking_number=${encodeURIComponent(trackingNumber.trim())}`)

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to search for package"

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use the text or default message
          errorMessage = errorText || errorMessage
        }

        setError(errorMessage)
        return
      }

      const data = await response.json()

      if (data.data) {
        setPackageDetails(data.data)
      } else {
        setError("Package not found")
      }
    } catch (err) {
      console.error("Tracking search error:", err)
      setError("Failed to search for package. Please check your connection and try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "exception":
      case "failed_delivery":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "in_transit":
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />
      default:
        return <Package className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Track Package</h1>
        <p className="text-slate-600 mt-2">
          Enter a tracking number to get real-time updates on your package.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Package Tracking
          </CardTitle>
          <CardDescription>
            Enter your tracking number to see detailed shipping information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter tracking number (e.g., 1Z999AA10123456784)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              size="lg"
              className="px-8"
            >
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package Details */}
      {packageDetails && (
        <div className="space-y-6">
          {/* Package Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {packageDetails.tracking_number}
                </CardTitle>
                <StatusBadge status={packageDetails.status} />
              </div>
              <CardDescription>
                {packageDetails.carrier} • Created {new Date(packageDetails.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Origin</p>
                  <p className="text-slate-900">{packageDetails.origin || "Unknown"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Destination</p>
                  <p className="text-slate-900">{packageDetails.destination}</p>
                </div>
                {packageDetails.current_location && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Current Location</p>
                    <p className="text-slate-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {packageDetails.current_location}
                    </p>
                  </div>
                )}
                {packageDetails.estimated_delivery && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Estimated Delivery</p>
                    <p className="text-slate-900 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-500" />
                      {new Date(packageDetails.estimated_delivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tracking History
              </CardTitle>
              <CardDescription>
                Detailed timeline of your package's journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {packageDetails.tracking_updates && packageDetails.tracking_updates.length > 0 ? (
                <div className="space-y-4">
                  {packageDetails.tracking_updates.map((update, index) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                          {getStatusIcon(update.status)}
                        </div>
                        {index !== packageDetails.tracking_updates.length - 1 && (
                          <div className="w-0.5 h-8 bg-slate-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {update.status.replace("_", " ").toUpperCase()}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {new Date(update.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {update.location && (
                          <p className="text-sm text-slate-700 mb-1">
                            📍 {update.location}
                          </p>
                        )}
                        {update.description && (
                          <p className="text-sm text-slate-600">{update.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No tracking updates available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Text */}
      {!packageDetails && !error && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Track any package</p>
                <p className="text-sm text-blue-700">
                  Enter a tracking number from any major carrier (UPS, FedEx, DHL, USPS) to get real-time updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
