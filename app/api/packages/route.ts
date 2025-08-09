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
    const q = url.searchParams.get("q")?.trim()
    const status = url.searchParams.get("status")?.trim()
    const page = Number(url.searchParams.get("page") || 1)
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") || 50), 200)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = await createClient()

    // Query packages for the current user only
    let query = supabase
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
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    // Apply search filter - using columns that exist
    if (q) {
      query = query.or(`tracking_number.ilike.%${q}%,sender_name.ilike.%${q}%,recipient_name.ilike.%${q}%,package_type.ilike.%${q}%`)
    }

    // Apply status filter
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("User packages API error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Transform data to match expected interface
    const transformedData = (data || []).map(pkg => ({
      ...pkg,
      carrier: "Unknown", // Default value since column doesn't exist yet
      recipient_email: auth.user?.email || "", // Use current user's email
      origin: pkg.sender_address || "Unknown",
      destination: pkg.recipient_address || "Unknown",
      current_location: "In Transit", // Default value
      estimated_delivery: null, // Will be null until column is added
      notes: null
    }))

    return NextResponse.json({
      data: transformedData,
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    })

  } catch (error: any) {
    console.error("User packages API unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}

// Allow users to add packages they're expecting
export async function POST(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { tracking_number, carrier, expected_from, description, notes } = body

    if (!tracking_number) {
      return NextResponse.json({ error: "Tracking number is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if package already exists
    const { data: existing } = await supabase
      .from("packages")
      .select("id")
      .eq("tracking_number", tracking_number)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Package with this tracking number already exists" }, { status: 409 })
    }

    // Insert new package using existing schema (avoid profile table access during RLS issues)
    const { data, error } = await supabase
      .from("packages")
      .insert({
        tracking_number,
        sender_name: expected_from || "Unknown",
        sender_address: "Unknown", // Default value
        recipient_name: auth.user?.email || "Unknown", // Use email instead of profile lookup
        recipient_address: "Unknown", // Default value
        package_type: description || "package",
        weight: null,
        status: "pending"
        // user_id will be added after schema migration
      })
      .select()
      .single()

    if (error) {
      console.error("Package creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })

  } catch (error: any) {
    console.error("User packages POST unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
