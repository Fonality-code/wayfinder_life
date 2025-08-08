"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, Calendar, Truck, CheckCircle, Clock, AlertCircle, Weight, Ruler, Tag } from "lucide-react"

interface TrackingData {
  trackingNumber: string
  status: string
  carrier: string
  estimatedDelivery: string
  currentLocation: string
  destination: string
  packageInfo: {
    weight: string
    dimensions: string
    service: string
  }
  timeline: Array<{
    status: string
    location: string
    timestamp: string
    description: string
  }>
}

interface TrackingResultProps {
  data: TrackingData
}

export function TrackingResult({ data }: TrackingResultProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "out for delivery":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "in transit":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in transit":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Package Status</CardTitle>
            <Badge className={`${getStatusColor(data.status)} font-semibold`}>
              {getStatusIcon(data.status)}
              <span className="ml-2">{data.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Tracking Number:</span>
                <span className="font-mono text-sm">{data.trackingNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Carrier:</span>
                <span className="text-sm">{data.carrier}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Est. Delivery:</span>
                <span className="text-sm">{data.estimatedDelivery}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Current Location:</span>
                <span className="text-sm">{data.currentLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Destination:</span>
                <span className="text-sm">{data.destination}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Information */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Package Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Weight:</span>
              <span className="text-sm">{data.packageInfo.weight}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Dimensions:</span>
              <span className="text-sm">{data.packageInfo.dimensions}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Service:</span>
              <span className="text-sm">{data.packageInfo.service}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Tracking Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-blue-600" : "bg-gray-300"}`} />
                  {index < data.timeline.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{event.status}</span>
                    <Badge variant="outline" className="text-xs">
                      {event.location}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                  <p className="text-xs text-gray-500">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
