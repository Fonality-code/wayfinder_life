import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const admin = createAdminClient()

    // Get all profiles to see what's in the database
    const { data: allProfiles, error: allError } = await admin
      .from("profiles")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false })

    if (allError) {
      return NextResponse.json({ error: allError.message }, { status: 500 })
    }

    // Get just admin profiles
    const { data: adminProfiles, error: adminError } = await admin
      .from("profiles")
      .select("id, email, role, created_at")
      .eq("role", "admin")

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 })
    }

    return NextResponse.json({
      totalProfiles: allProfiles?.length || 0,
      adminProfiles: adminProfiles?.length || 0,
      allProfiles: allProfiles?.map(p => ({
        email: p.email,
        role: p.role,
        id: p.id.substring(0, 8) + "..."
      })),
      admins: adminProfiles?.map(p => ({
        email: p.email,
        role: p.role,
        id: p.id.substring(0, 8) + "..."
      }))
    })

  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to query profiles",
      message: error.message
    }, { status: 500 })
  }
}
