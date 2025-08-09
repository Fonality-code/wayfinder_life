import { NextResponse } from "next/server"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET /api/packages/track?tracking_number=...
export async function GET(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const trackingNumber = url.searchParams.get("tracking_number")

    if (!trackingNumber) {
      return NextResponse.json({ error: "tracking_number parameter is required" }, { status: 400 })
    }

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
      console.error("Package lookup error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
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
      is_owned: true // Assume owned for now since we found it
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
      console.error("Tracking updates error:", trackingError)
      // Don't fail the entire request, just log the error
    }

    return NextResponse.json({
      data: {
        ...transformedPkg,
        tracking_updates: trackingUpdates || []
      }
    })

  } catch (e: any) {
    console.error("Track API unexpected error:", e)
    return NextResponse.json({ error: e?.message ?? "Internal Server Error" }, { status: 500 })
  }
}
