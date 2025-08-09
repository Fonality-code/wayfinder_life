import "server-only"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const packageId = url.searchParams.get("package_id")
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200)

    const supabase = await createClient()

    let query = supabase
      .from("tracking_updates")
      .select(`
        id,
        package_id,
        status,
        location,
        timestamp,
        description,
        created_at,
        packages!inner (
          id,
          tracking_number,
          recipient_email
        )
      `)
      .eq("packages.recipient_email", auth.user.email) // Only show tracking for user's packages
      .order("timestamp", { ascending: false })
      .limit(limit)

    // Filter by specific package if provided
    if (packageId) {
      query = query.eq("package_id", packageId)
    }

    const { data, error } = await query

    if (error) {
      console.error("User tracking API error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: data || []
    })

  } catch (error: any) {
    console.error("User tracking API unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
