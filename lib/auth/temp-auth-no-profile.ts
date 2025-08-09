import "server-only"
import { createClient } from "@/lib/supabase/server"

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
 * Temporary auth function that avoids profile table access during RLS issues
 * This prevents the infinite recursion error
 */
export async function getAuthenticatedUserWithRoleNoProfile(): Promise<AuthResult> {
  try {
    console.log("🔍 AUTH: Starting authentication check (no profile)...")

    // Get current authenticated user from server client
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("🔍 AUTH: No authenticated user:", userError?.message)
      return { user: null, role: null, profile: null }
    }

    console.log("🔍 AUTH: User authenticated:", user.id, user.email)

    // For now, assume regular users are 'user' role
    // Admin role detection will be added after RLS fix
    const assumedRole: AppRole = "user"

    // Check if this is the admin user (hardcoded check for now)
    const isAdminEmail = user.email === "your-admin@email.com" // Update this
    const finalRole: AppRole = isAdminEmail ? "admin" : "user"

    const authResult: AuthResult = {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || null
      },
      role: finalRole,
      profile: null // Skip profile lookup to avoid RLS recursion
    }

    console.log("🔍 AUTH: Final result (no profile) - Role:", finalRole)
    return authResult

  } catch (error: any) {
    console.error("🔍 AUTH: Unexpected error:", error.message)
    return { user: null, role: null, profile: null }
  }
}
