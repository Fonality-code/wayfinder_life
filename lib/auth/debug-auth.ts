import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type AppRole = "admin" | "user"

export type AuthResult = {
  user: {
    id: string
    email: string | null
    displayName: string | null
  } | null
  role: AppRole | null
  profile: {
    id: string
    email: string | null
    role: AppRole | null
    full_name: string | null
    created_at?: string
  } | null
}

/**
 * Simplified auth function based on the working debug endpoint approach
 * Uses direct admin client to bypass RLS issues
 */
export async function getAuthenticatedUserWithRole(): Promise<AuthResult> {
  try {
    console.log("🔍 AUTH: Starting authentication check...")

    // Step 1: Get current authenticated user from server client
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("🔍 AUTH: No authenticated user:", userError?.message)
      return { user: null, role: null, profile: null }
    }

    console.log("🔍 AUTH: User authenticated:", user.id, user.email)

    // Step 2: Get user profile and role using admin client (bypasses RLS)
    const admin = createAdminClient()
    const { data: profileData, error: profileError } = await admin
      .from("profiles")
      .select("id, email, role, full_name, created_at")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("🔍 AUTH: Profile query error:", profileError.message)
      // Continue with user creation below
    }

    let profile = profileData
    let role: AppRole = "user"

    // Step 3: Create profile if it doesn't exist
    if (!profile) {
      console.log("🔍 AUTH: Profile not found by id, trying email fallback...")

      // Fallback read by email to support legacy rows keyed by email
      if (user.email) {
        const { data: emailProfile, error: emailErr } = await admin
          .from("profiles")
          .select("id, email, role, full_name, created_at")
          .eq("email", user.email)
          .maybeSingle()

        if (emailProfile && !emailErr) {
          profile = emailProfile
          role = (emailProfile.role as AppRole) ?? "user"
          console.log("🔍 AUTH: Found legacy profile by email; using its role.")
        }
      }

      // If still no profile, insert a new baseline
      if (!profile) {
        console.log("🔍 AUTH: No profile by id/email; creating baseline profile...")

        const displayName =
          (user.user_metadata as any)?.name ??
          (user.user_metadata as any)?.full_name ??
          (user.user_metadata as any)?.user_name ??
          null

        const { error: insertError } = await admin
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email || null,
            full_name: displayName,
            role: "user",
          })

        if (insertError) {
          console.error("🔍 AUTH: Profile creation error:", insertError.message)
          // Continue with re-query below
        }

        // Re-query after insert
        const { data: afterInsert, error: afterError } = await admin
          .from("profiles")
          .select("id, email, role, full_name, created_at")
          .eq("id", user.id)
          .maybeSingle()

        if (!afterError && afterInsert) {
          profile = afterInsert
          role = (afterInsert.role as AppRole) ?? "user"
        }
      }
    } else {
      role = (profile.role as AppRole) ?? "user"
    }

    const displayName =
      (user.user_metadata as any)?.name ??
      (user.user_metadata as any)?.full_name ??
      (user.user_metadata as any)?.user_name ??
      profile?.full_name ??
      null

    console.log("🔍 AUTH: Final result - Role:", role, "Profile:", !!profile)

    return {
      user: {
        id: user.id,
        email: user.email || null,
        displayName
      },
      role,
      profile
    }

  } catch (error: any) {
    console.error("🔍 AUTH: Unexpected error:", error.message)
    return { user: null, role: null, profile: null }
  }
}
