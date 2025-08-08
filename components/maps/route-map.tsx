"use client"

import { useEffect, useRef, useState } from "react"
import type { Route, TrackingUpdate } from "@/lib/types"

interface RouteMapProps {
  routes?: Route[]
  trackingUpdates?: TrackingUpdate[]
  selectedRoute?: Route | null
  className?: string
}

export function RouteMap({ routes = [], trackingUpdates = [], selectedRoute, className }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import Leaflet
        const L = (await import("leaflet")).default

        // Import CSS
        await import("leaflet/dist/leaflet.css")

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        if (!mapRef.current) return

        // Clear existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        // Clear existing markers
        markersRef.current = []

        // Initialize map
        const map = L.map(mapRef.current, {
          center: [39.8283, -98.5795], // Center of USA
          zoom: 4,
          zoomControl: true,
          scrollWheelZoom: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map)

        mapInstanceRef.current = map

        // Add routes and markers
        if (routes.length > 0) {
          addRoutesToMap(L, map, routes, selectedRoute, trackingUpdates)
        } else {
          // If no routes, show a default view
          map.setView([40.7128, -74.006], 10) // New York
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("Failed to load map")
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markersRef.current = []
    }
  }, [routes, selectedRoute, trackingUpdates])

  const addRoutesToMap = (
    L: any,
    map: any,
    routes: Route[],
    selectedRoute: Route | null,
    updates: TrackingUpdate[],
  ) => {
    const bounds = L.latLngBounds([])
    let hasValidCoordinates = false

    routes.forEach((route) => {
      if (route.origin_lat && route.origin_lng && route.destination_lat && route.destination_lng) {
        hasValidCoordinates = true

        const isSelected = selectedRoute?.id === route.id
        const routeColor = route.color || "#3B82F6"

        // Create route line
        const routeLine = L.polyline(
          [
            [route.origin_lat, route.origin_lng],
            [route.destination_lat, route.destination_lng],
          ],
          {
            color: routeColor,
            weight: isSelected ? 6 : 3,
            opacity: isSelected ? 1 : 0.7,
            dashArray: isSelected ? null : "5, 10",
          },
        ).addTo(map)

        // Add to bounds
        bounds.extend([route.origin_lat, route.origin_lng])
        bounds.extend([route.destination_lat, route.destination_lng])

        // Create custom origin marker
        const originIcon = L.divIcon({
          className: "custom-marker origin-marker",
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background: ${routeColor};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: white;
              font-weight: bold;
            ">
              O
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        // Create custom destination marker
        const destinationIcon = L.divIcon({
          className: "custom-marker destination-marker",
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background: ${routeColor};
              border: 3px solid white;
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: white;
              font-weight: bold;
            ">
              D
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        // Add origin marker
        const originMarker = L.marker([route.origin_lat, route.origin_lng], { icon: originIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: ${routeColor}; font-size: 16px;">${route.name}</h3>
              <p style="margin: 0 0 4px 0; font-weight: 600;">Origin</p>
              <p style="margin: 0; color: #666;">${route.origin}</p>
              ${route.estimated_duration_hours ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">Estimated: ${route.estimated_duration_hours}h</p>` : ""}
            </div>
          `)

        // Add destination marker
        const destinationMarker = L.marker([route.destination_lat, route.destination_lng], { icon: destinationIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: ${routeColor}; font-size: 16px;">${route.name}</h3>
              <p style="margin: 0 0 4px 0; font-weight: 600;">Destination</p>
              <p style="margin: 0; color: #666;">${route.destination}</p>
            </div>
          `)

        markersRef.current.push(routeLine, originMarker, destinationMarker)

        // Add tracking updates for selected route
        if (isSelected && updates.length > 0) {
          addTrackingUpdates(L, map, updates, routeColor)
        }
      }
    })

    // Add tracking updates as standalone markers if no route is selected
    if (!selectedRoute && updates.length > 0) {
      addTrackingUpdates(L, map, updates, "#10B981")
    }

    // Fit map to bounds if we have valid coordinates
    if (hasValidCoordinates && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }

  const addTrackingUpdates = (L: any, map: any, updates: TrackingUpdate[], color: string) => {
    updates.forEach((update, index) => {
      if (update.latitude && update.longitude) {
        // Create tracking update marker
        const updateIcon = L.divIcon({
          className: "custom-marker tracking-marker",
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: white;
              font-weight: bold;
              animation: pulse 2s infinite;
            ">
              ${index + 1}
            </div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
            </style>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const updateMarker = L.marker([update.latitude, update.longitude], { icon: updateIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 16px;">${update.location}</h3>
              <p style="margin: 0 0 4px 0; font-weight: 600;">${update.status}</p>
              ${update.description ? `<p style="margin: 0 0 8px 0; color: #666;">${update.description}</p>` : ""}
              <p style="margin: 0; font-size: 12px; color: #888;">${new Date(update.timestamp).toLocaleString()}</p>
            </div>
          `)

        markersRef.current.push(updateMarker)
      }
    })
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Map Error</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-96 w-full rounded-lg" />

      {/* Map Legend */}
      {routes.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <h4 className="font-semibold text-sm mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              <span>Origin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded border border-white"></div>
              <span>Destination</span>
            </div>
            {trackingUpdates.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span>Tracking Updates</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
