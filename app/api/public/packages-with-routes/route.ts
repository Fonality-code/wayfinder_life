import "server-only"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET /api/public/packages-with-routes
// Public endpoint to fetch packages that have routes assigned (for homepage display)
export async function GET() {
  try {
    // Use anonymous Supabase client for public access
    const supabase = await createClient()

    // Fetch packages that have routes assigned
    const { data: packages, error } = await supabase
      .from("packages")
      .select(`
        id,
        tracking_number,
        sender_name,
        recipient_name,
        status,
        package_type,
        created_at,
        route:routes!packages_route_id_fkey(
          id,
          name,
          origin,
          destination,
          estimated_duration_hours,
          origin_lat,
          origin_lng,
          destination_lat,
          destination_lng,
          waypoints,
          color
        )
      `)
      .not("route_id", "is", null)
      .eq("status", "in_transit") // Only show packages currently in transit
      .order("created_at", { ascending: false })
      .limit(6) // Limit to 6 packages for homepage display

    if (error) {
      console.error("Public packages with routes lookup error:", error)
      return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
    }

    return NextResponse.json({ data: packages ?? [] })
  } catch (error: any) {
    console.error("Public packages with routes unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
