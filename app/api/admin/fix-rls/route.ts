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

    const admin = createAdminClient()

    // Execute the RLS fix step by step
    const fixes = [
      // Disable RLS on profiles temporarily
      "ALTER TABLE profiles DISABLE ROW LEVEL SECURITY",

      // Drop problematic policies
      `DROP POLICY IF EXISTS "Users can view own profile" ON profiles`,
      `DROP POLICY IF EXISTS "Users can update own profile" ON profiles`,
      `DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles`,

      // Create simple policies
      `CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id)`,
      `CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id)`,

      // Re-enable RLS
      "ALTER TABLE profiles ENABLE ROW LEVEL SECURITY",

      // Fix package policies
      `DROP POLICY IF EXISTS "Admins can view all packages" ON packages`,
      `DROP POLICY IF EXISTS "Admins can insert packages" ON packages`,
      `DROP POLICY IF EXISTS "Admins can update packages" ON packages`,
      `DROP POLICY IF EXISTS "Users can view own packages" ON packages`,
      `DROP POLICY IF EXISTS "Users can create own packages" ON packages`,
      `DROP POLICY IF EXISTS "Admins can manage all packages" ON packages`,
      `CREATE POLICY "packages_public_select" ON packages FOR SELECT USING (true)`,

      // Fix tracking policies
      `DROP POLICY IF EXISTS "Users can view tracking updates for own packages" ON tracking_updates`,
      `DROP POLICY IF EXISTS "Admins can manage all tracking updates" ON tracking_updates`,
      `CREATE POLICY "tracking_updates_public_select" ON tracking_updates FOR SELECT USING (true)`,

      // Fix routes policies
      `DROP POLICY IF EXISTS "Admins can manage routes" ON routes`,
      `DROP POLICY IF EXISTS "Anyone can view routes" ON routes`,
      `CREATE POLICY "routes_public_select" ON routes FOR SELECT USING (true)`,

      // Remove app_settings policies
      `DROP POLICY IF EXISTS "Admin can manage app settings" ON app_settings`
    ]

    const results = []

    for (const sql of fixes) {
      try {
        await admin.rpc('exec_sql', { sql })
        results.push({ sql, success: true })
      } catch (error: any) {
        // Some errors are expected (like dropping non-existent policies)
        results.push({
          sql,
          success: false,
          error: error.message,
          expected: sql.includes("DROP POLICY IF EXISTS")
        })
      }
    }

    return NextResponse.json({
      message: "RLS recursion fix completed",
      results,
      summary: {
        total: fixes.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success && !r.expected).length,
        expected_failures: results.filter(r => !r.success && r.expected).length
      }
    })

  } catch (error: any) {
    console.error("RLS fix error:", error)
    return NextResponse.json(
      { error: "Failed to fix RLS recursion", message: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
