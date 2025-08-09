import { NextResponse } from "next/server"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import { ensureProfileAndGetRole } from "@/lib/auth/role"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("🔍 DEBUG: Testing auth functions...")

    // Test the new debug auth function (now used in admin components)
    const debugResult = await getAuthenticatedUserWithRole()
    console.log("🔍 getAuthenticatedUserWithRole result:", debugResult)

    // Test the old function for comparison
    const oldResult = await ensureProfileAndGetRole()
    console.log("🔍 ensureProfileAndGetRole result:", oldResult)

    return NextResponse.json({
      debug: "Comparing old vs new auth functions",
      newDebugAuth: {
        hasUser: !!debugResult.user,
        userId: debugResult.user?.id,
        role: debugResult.role,
        profileRole: debugResult.profile?.role,
        email: debugResult.user?.email
      },
      oldAuth: {
        hasUser: !!oldResult.user,
        userId: oldResult.user?.id,
        role: oldResult.role,
        profileRole: oldResult.profile?.role,
        email: oldResult.user?.email
      },
      comparison: {
        sameUser: debugResult.user?.id === oldResult.user?.id,
        sameRole: debugResult.role === oldResult.role,
        bothAdmin: debugResult.role === "admin" && oldResult.role === "admin",
        newIsAdmin: debugResult.role === "admin",
        oldIsAdmin: oldResult.role === "admin"
      }
    })

  } catch (error: any) {
    console.error("🔍 DEBUG: Error comparing auth functions:", error)
    return NextResponse.json({
      error: "Comparison failed",
      message: error.message
    }, { status: 500 })
  }
}
