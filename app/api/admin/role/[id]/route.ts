import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

// GET /api/admin/role/:id
// Secure server endpoint to fetch a user's role by UUID from public.profiles.
// Uses the service-role client (server-only) so RLS cannot hide the row [^1].
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,role,created_at")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (!data) {
      return NextResponse.json(
        { found: false, message: "Profile not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ found: true, profile: data })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
