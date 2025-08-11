import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET /api/public/track?tracking_number=...
// Public endpoint for tracking packages without authentication
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const trackingNumber = url.searchParams.get("tracking_number")

    if (!trackingNumber) {
      return NextResponse.json({ error: "tracking_number parameter is required" }, { status: 400 })
    }

    // Use anonymous Supabase client for public access
    const supabase = await createClient()

    // Find the package - using existing schema columns
    const { data: pkg, error } = await supabase
      .from("packages")
      .select(`
        id,
        tracking_number,
        sender_name,
        recipient_name,
        sender_address,
        recipient_address,
        package_type,
        weight,
        status,
        created_at,
        updated_at
      `)
      .eq("tracking_number", trackingNumber)
      .maybeSingle()

    if (error) {
      console.error("Public package lookup error:", error)
      return NextResponse.json({ error: "Failed to lookup package" }, { status: 500 })
    }

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Transform to match expected interface
    const transformedPkg = {
      ...pkg,
      carrier: "Unknown", // Default since column doesn't exist yet
      origin: pkg.sender_address || "Unknown",
      destination: pkg.recipient_address || "Unknown",
      current_location: pkg.status === "delivered" ? "Delivered" : "In Transit",
      estimated_delivery: null, // Will be null until column exists
    }

    // Get tracking updates for this package
    const { data: trackingUpdates, error: trackingError } = await supabase
      .from("tracking_updates")
      .select(`
        id,
        status,
        location,
        description,
        timestamp,
        created_at
      `)
      .eq("package_id", pkg.id)
      .order("timestamp", { ascending: false })

    if (trackingError) {
      console.error("Public tracking updates error:", trackingError)
      // Don't fail the entire request, just log the error
    }

    return NextResponse.json({
      data: {
        ...transformedPkg,
        tracking_updates: trackingUpdates || []
      }
    })

  } catch (e: any) {
    console.error("Public track API unexpected error:", e)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
