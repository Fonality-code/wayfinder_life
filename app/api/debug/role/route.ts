import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ensureProfileAndGetRole } from "@/lib/auth/role"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("🔍 DEBUG: Starting role debug check...")

    // Test 1: Get current authenticated user
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({
        error: "Not authenticated",
        userError: userError?.message
      }, { status: 401 })
    }

    console.log("🔍 DEBUG: User authenticated:", user.id, user.email)

    // Test 2: Use admin client to directly query profiles
    const admin = createAdminClient()
    const { data: profileData, error: profileError } = await admin
      .from("profiles")
      .select("id, email, role, created_at")
      .eq("id", user.id)
      .maybeSingle()

    console.log("🔍 DEBUG: Direct profile query result:", profileData, profileError?.message)

    // Test 3: Use our role function
    const roleResult = await ensureProfileAndGetRole()
    console.log("🔍 DEBUG: ensureProfileAndGetRole result:", roleResult)

    // Test 4: REST API approach
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (serviceKey && baseUrl) {
      const restResponse = await fetch(`${baseUrl}/rest/v1/profiles?select=id,email,role&id=eq.${user.id}`, {
        headers: {
          'apikey': serviceKey,
          'authorization': `Bearer ${serviceKey}`,
          'content-type': 'application/json'
        }
      })

      const restData = await restResponse.json()
      console.log("🔍 DEBUG: REST API result:", restData)
    }

    return NextResponse.json({
      debug: "Role detection debug info",
      userId: user.id,
      userEmail: user.email,
      profileFromAdmin: profileData,
      profileError: profileError?.message,
      roleFunction: {
        user: roleResult.user,
        role: roleResult.role,
        profile: roleResult.profile
      },
      environment: {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "..."
      }
    })

  } catch (error: any) {
    console.error("🔍 DEBUG: Error in role debug:", error)
    return NextResponse.json({
      error: "Debug failed",
      message: error.message
    }, { status: 500 })
  }
}
