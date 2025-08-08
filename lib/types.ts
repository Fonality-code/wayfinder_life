export interface Package {
  id: string
  tracking_number: string
  sender_name: string
  recipient_name: string
  sender_address: string
  recipient_address: string
  current_location: string
  destination: string
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled" | "delayed"
  estimated_delivery: string
  actual_delivery?: string
  weight?: number
  dimensions?: string
  service_type: string
  created_at: string
  updated_at: string
}

export interface TrackingUpdate {
  id: string
  package_id: string
  status: string
  location: string
  description: string
  timestamp: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Route {
  id: string
  name: string
  origin: string
  destination: string
  distance: number
  estimated_duration: number
  waypoints?: string[]
  created_at: string
  updated_at: string
}
