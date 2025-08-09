import "server-only"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET() {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get all packages since we can't filter by user yet
    // In production, you'd want to add user_id or similar filtering
    const { data: packages, error: packagesError } = await supabase
      .from("packages")
      .select("id, status, created_at")
      .limit(100) // Limit results for now

    if (packagesError) {
      console.error("User stats packages error:", packagesError)
      return NextResponse.json({ error: packagesError.message }, { status: 400 })
    }

    // Get recent tracking updates
    const { data: trackingUpdates, error: trackingError } = await supabase
      .from("tracking_updates")
      .select(`
        id,
        status,
        timestamp,
        created_at,
        packages!inner (
          id,
          tracking_number
        )
      `)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .order("created_at", { ascending: false })
      .limit(20)

    if (trackingError) {
      console.error("User stats tracking error:", trackingError)
      // Don't fail the entire request, just log the error
    }

    const allPackages = packages || []
    const recentUpdates = trackingUpdates || []

    // Calculate stats
    const today = new Date().toDateString()
    const stats = {
      total: allPackages.length,
      inTransit: allPackages.filter(p =>
        ["shipped", "in_transit", "out_for_delivery"].includes(p.status)
      ).length,
      delivered: allPackages.filter(p => p.status === "delivered").length,
      exceptions: allPackages.filter(p =>
        ["exception", "failed_delivery", "returned"].includes(p.status)
      ).length,
      deliveredToday: allPackages.filter(p => {
        return p.status === "delivered" &&
               new Date(p.estimated_delivery || p.created_at).toDateString() === today
      }).length,
      updatesThisWeek: recentUpdates.length
    }

    return NextResponse.json({
      stats,
      recentUpdates: recentUpdates.slice(0, 5), // Latest 5 updates
      recentPackages: allPackages
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5) // Latest 5 packages
    })

  } catch (error: any) {
    console.error("User dashboard stats unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
