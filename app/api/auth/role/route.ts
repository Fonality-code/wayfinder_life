import "server-only"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // No-op here; middleware handles refresh. Avoid mutating response in this route.
          },
        },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ role: null, error: userError?.message ?? null }, { status: 401 })
    }

    const admin = createAdminClient()

    // Try by id first
    const { data: profileById } = await admin
      .from("profiles")
      .select("id, email, role, full_name")
      .eq("id", user.id)
      .maybeSingle()

    let profile = profileById

    // Fallback by email to support legacy rows
    if (!profile && user.email) {
      const { data: profileByEmail } = await admin
        .from("profiles")
        .select("id, email, role, full_name")
        .eq("email", user.email)
        .maybeSingle()
      profile = profileByEmail
    }

    const role = (profile?.role ?? null) as "admin" | "user" | null

    return NextResponse.json(
      {
        userId: user.id,
        email: user.email,
        displayName:
          (user.user_metadata as any)?.name ??
          (user.user_metadata as any)?.full_name ??
          (user.user_metadata as any)?.user_name ??
          profile?.full_name ??
          null,
        role,
        profileRole: profile?.role ?? null,
        profileId: profile?.id ?? null,
        supabaseUrlUsed:
          process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: "Auth role API failed", message: error?.message ?? String(error) },
      { status: 500 }
    )
  }
}
