import "server-only"
import { NextResponse } from "next/server"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST() {
  try {
    const auth = await getAuthenticatedUserWithRole()

    // Only allow admin users to run database fixes
    if (!auth.user || auth.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Since we can't execute raw SQL easily, let's provide instructions for manual fix
    const admin = createAdminClient()

    // Test if we can access the profiles table without issues
    try {
      const { data: testProfiles, error: testError } = await admin
        .from("profiles")
        .select("id, role")
        .limit(1)

      if (testError) {
        throw testError
      }

      return NextResponse.json({
        message: "Database access test successful",
        recommendation: "The RLS recursion issue needs to be fixed manually through your database admin panel",
        instructions: [
          "1. Access your Supabase dashboard",
          "2. Go to SQL Editor",
          "3. Copy and execute the contents of scripts/fix-rls-recursion-final.sql",
          "4. This will properly clean up existing policies and create new non-recursive ones"
        ],
        alternative: "You can also run: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY; temporarily to bypass the issue",
        testResult: {
          profilesAccessible: true,
          sampleCount: testProfiles?.length || 0
        }
      })

    } catch (error: any) {
      // If we get a recursion error, provide specific guidance
      if (error.message?.includes("infinite recursion") || error.message?.includes("recursion")) {
        return NextResponse.json({
          error: "RLS recursion detected",
          message: "The profiles table has recursive policies that need manual fixing",
          urgentFix: "Execute this SQL immediately in your database: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;",
          fullFix: "Then run the complete fix script: scripts/fix-rls-recursion.sql",
          explanation: "The current RLS policies on profiles table reference themselves when checking admin roles, causing infinite recursion"
        }, { status: 500 })
      }

      throw error
    }

  } catch (error: any) {
    console.error("RLS fix error:", error)
    return NextResponse.json(
      {
        error: "Failed to test database access",
        message: error?.message || "Unknown error",
        recommendation: "Disable RLS temporarily: ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;"
      },
      { status: 500 }
    )
  }
}
