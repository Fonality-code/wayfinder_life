import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

type Role = "admin" | "user"

export async function getUserAndRole() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return { user: null, role: null as Role | null, profile: null as any }
  }

  const admin = createAdminClient()

  // Read profile via admin client to bypass RLS and avoid recursive policies.
  let role: Role = "user"
  let profile: any = null

  const { data: existing, error: selectErr } = await admin
    .from("profiles")
    .select("id, role, email, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  if (selectErr) {
    // Non-fatal; continue with baseline creation below if needed.
    // console.warn("profiles: select error", (selectErr as any)?.message ?? selectErr)
  }

  if (!existing) {
    // Insert a default profile if missing (never overwrites roles later).
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
      // Handle race: if another request inserted concurrently, ignore and reselect.
      // @ts-ignore supabase error may have code
      if (insertErr.code !== "23505") {
        // Non-unique-violation; we proceed with defaults.
      }
    }

    // Re-select for a stable role response.
    const { data: after, error: afterErr } = await admin
      .from("profiles")
      .select("id, role, email, full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()

    if (!afterErr && after) {
      role = (after.role as Role) ?? "user"
      profile = after
    } else {
      role = "user"
      profile = null
    }
  } else {
    role = (existing.role as Role) ?? "user"
    profile = existing
  }

  return { user, role, profile }
}
