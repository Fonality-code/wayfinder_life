export interface Package {
  id: string
  tracking_number: string
  sender_name: string
  sender_address: string
  recipient_name: string
  recipient_address: string
  package_type: string
  weight: number | null
  status: "pending" | "in_transit" | "delivered" | "cancelled"
  user_id?: string | null
  created_at: string
  updated_at: string
  // Existing additional fields
  carrier?: string
  recipient_email?: string
  origin?: string
  destination?: string
  current_location?: string
  estimated_delivery?: string
  dimensions?: string
  notes?: string
  route_id?: string | null
  // New payment and transport fields
  transport_type?: "air" | "ship" | "truck" | "rail" | "local" | null
  payment_method?: "credit_card" | "debit_card" | "paypal" | "bank_transfer" | "cash" | "check" | "cod" | "prepaid" | null
  payment_amount?: number | null
  payment_currency?: string
  payment_status?: "pending" | "paid" | "partial" | "refunded" | "cancelled"
  payment_date?: string | null
  shipping_cost?: number | null
  total_cost?: number | null
  insurance_cost?: number | null
  handling_fee?: number | null
  expected_delivery_time?: number | null
}

export interface TrackingUpdate {
  id: string
  package_id: string
  location: string
  status: string
  description: string | null
  timestamp: string
  latitude?: number | null
  longitude?: number | null
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name?: string | null
  role: "user" | "admin"
  created_at: string
  updated_at?: string
}

export interface Route {
  id: string
  name: string
  origin: string
  destination: string
  estimated_duration_hours: number | null
  origin_lat?: number | null
  origin_lng?: number | null
  destination_lat?: number | null
  destination_lng?: number | null
  color?: string | null
  created_at: string
}
