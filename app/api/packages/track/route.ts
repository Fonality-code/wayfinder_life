import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST /api/packages/track
// body: { trackingNumber: string }
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()

    if (userErr || !user) {
      return NextResponse.json({ error: userErr?.message || "Unauthorized" }, { status: 401 })
    }

    const { trackingNumber } = await req.json().catch(() => ({}))
    if (!trackingNumber || typeof trackingNumber !== "string") {
      return NextResponse.json({ error: "trackingNumber is required" }, { status: 400 })
    }

    // Find the exact tracking number for this user.
    // If you want global tracking lookup, remove the user_id filter and add RLS policies appropriately. [^1]
    const { data: pkg, error } = await supabase
      .from("packages")
      .select(
        `
        id,
        tracking_number,
        status,
        current_location,
        destination,
        estimated_delivery,
        created_at,
        tracking_updates (
          id,
          status,
          location,
          description,
          timestamp,
          created_at
        )
      `
      )
      .eq("user_id", user.id)
      .eq("tracking_number", trackingNumber)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ package: pkg })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal Server Error" }, { status: 500 })
  }
}
