"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Package, Loader2 } from "lucide-react"
import { TrackingResult } from "./tracking-result"

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

export function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [error, setError] = useState("")

  const generateMockTrackingData = (trackingNum: string): TrackingData => {
    const carriers = ["FedEx", "UPS", "DHL", "USPS"]
    const statuses = ["In Transit", "Out for Delivery", "Delivered", "Processing"]
    const locations = [
      "New York, NY",
      "Los Angeles, CA",
      "Chicago, IL",
      "Houston, TX",
      "Phoenix, AZ",
      "Philadelphia, PA",
    ]

    const carrier = carriers[Math.floor(Math.random() * carriers.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const currentLocation = locations[Math.floor(Math.random() * locations.length)]
    const destination = locations[Math.floor(Math.random() * locations.length)]

    const timeline = [
      {
        status: "Package Received",
        location: "Origin Facility",
        timestamp: "2024-01-15 09:00 AM",
        description: "Package received at origin facility",
      },
      {
        status: "In Transit",
        location: "Sorting Facility",
        timestamp: "2024-01-15 02:30 PM",
        description: "Package sorted and loaded for transport",
      },
      {
        status: "In Transit",
        location: currentLocation,
        timestamp: "2024-01-16 08:15 AM",
        description: "Package arrived at intermediate facility",
      },
    ]

    if (status === "Out for Delivery") {
      timeline.push({
        status: "Out for Delivery",
        location: destination,
        timestamp: "2024-01-16 06:00 AM",
        description: "Package loaded on delivery vehicle",
      })
    } else if (status === "Delivered") {
      timeline.push(
        {
          status: "Out for Delivery",
          location: destination,
          timestamp: "2024-01-16 06:00 AM",
          description: "Package loaded on delivery vehicle",
        },
        {
          status: "Delivered",
          location: destination,
          timestamp: "2024-01-16 02:45 PM",
          description: "Package delivered successfully",
        },
      )
    }

    return {
      trackingNumber: trackingNum,
      status,
      carrier,
      estimatedDelivery: "January 17, 2024",
      currentLocation,
      destination,
      packageInfo: {
        weight: "2.5 lbs",
        dimensions: '12" x 8" x 4"',
        service: `${carrier} Ground`,
      },
      timeline,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setIsLoading(true)
    setError("")
    setTrackingData(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock tracking data
      const mockData = generateMockTrackingData(trackingNumber.trim())
      setTrackingData(mockData)
    } catch (err) {
      setError("Failed to fetch tracking information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setTrackingNumber("")
    setTrackingData(null)
    setError("")
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Track Your Package
          </CardTitle>
          <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., 1Z999AA1234567890)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-lg bg-white/90"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
            )}
          </form>
        </CardContent>
      </Card>

      {trackingData && (
        <div className="space-y-4">
          <TrackingResult data={trackingData} />
          <div className="text-center">
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300"
            >
              Track Another Package
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
