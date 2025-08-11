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
  ArrowRight,
  Loader2
} from "lucide-react"

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
  status: string
  origin?: string
  destination: string
  current_location: string
  estimated_delivery: string | null
  created_at: string
  package_type?: string
  tracking_updates: TrackingUpdate[]
}

export function PublicTrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    try {
      setIsSearching(true)
      setError(null)
      setPackageDetails(null)

      const response = await fetch(`/api/public/track?tracking_number=${encodeURIComponent(trackingNumber.trim())}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to track package")
      }

      const data = await response.json()
      setPackageDetails(data.data)
    } catch (err: any) {
      setError(err.message || "Failed to track package")
      console.error("Tracking error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_transit":
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "out_for_delivery":
        return <MapPin className="h-4 w-4 text-orange-600" />
      case "exception":
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_transit":
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "exception":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch {
      return timestamp
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Track Your Package
          </CardTitle>
          <CardDescription>
            Enter your tracking number to get real-time updates on your package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter tracking number (e.g., 1Z999AA1234567890)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isSearching ? "Tracking..." : "Track"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Details */}
      {packageDetails && (
        <div className="space-y-6">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Details
                </span>
                <Badge className={`${getStatusColor(packageDetails.status)} border`}>
                  {getStatusIcon(packageDetails.status)}
                  <span className="ml-1 font-medium">
                    {packageDetails.status.replace("_", " ").toUpperCase()}
                  </span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tracking Number</p>
                  <p className="text-lg font-mono">{packageDetails.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Package Type</p>
                  <p className="text-lg">{packageDetails.package_type || "Package"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">From</p>
                  <p className="text-lg">
                    {packageDetails.sender_name && `${packageDetails.sender_name} - `}
                    {packageDetails.origin}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">To</p>
                  <p className="text-lg">
                    {packageDetails.recipient_name && `${packageDetails.recipient_name} - `}
                    {packageDetails.destination}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Location</p>
                  <p className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {packageDetails.current_location}
                  </p>
                </div>
                {packageDetails.estimated_delivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimated Delivery</p>
                    <p className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      {formatTimestamp(packageDetails.estimated_delivery)}
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
                Latest updates for your package
              </CardDescription>
            </CardHeader>
            <CardContent>
              {packageDetails.tracking_updates && packageDetails.tracking_updates.length > 0 ? (
                <div className="space-y-4">
                  {packageDetails.tracking_updates.map((update, index) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(update.status)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{update.status}</h4>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(update.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {update.location}
                        </p>
                        {update.description && (
                          <p className="text-sm text-gray-500 mt-1">{update.description}</p>
                        )}
                      </div>
                      {index < packageDetails.tracking_updates.length - 1 && (
                        <div className="absolute left-4 top-8 w-px h-4 bg-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No tracking updates available yet</p>
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
                  Enter a tracking number provided by your sender to get real-time updates.
                  No account required - just enter your tracking number and track instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
