import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Ensures a row exists in public.profiles for the authenticated user.
// - Reads auth user via cookie-bound server client.
// - Performs reads/writes to public.profiles via admin client to bypass RLS.
// - Never overwrites an existing role; inserts baseline row with role="user" only if missing.
export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()

    if (userErr || !user) {
      return NextResponse.json({ error: userErr?.message || "Unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()

    // Check for existing profile.
    const { data: existing } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ role: existing.role ?? "user" })
    }

    // Insert baseline profile if missing.
    const displayName =
      (user.user_metadata as any)?.name ??
      (user.user_metadata as any)?.full_name ??
      (user.user_metadata as any)?.user_name ??
      null

    const { error: insertErr } = await admin.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: displayName,
      role: "user",
    })

    if (insertErr) {
      // If race: unique_violation, re-read below; else return default.
      // @ts-ignore
      if (insertErr.code !== "23505") {
        return NextResponse.json({ role: "user", warning: "profile-create-failed" })
      }
    }

    const { data: after } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    return NextResponse.json({ role: after?.role ?? "user" })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 })
  }
}
