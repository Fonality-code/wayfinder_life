import "server-only"
import { NextResponse } from "next/server"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function POST() {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const admin = createAdminClient()

    // Read the migration script
    const migrationPath = path.join(process.cwd(), "scripts", "update-packages-schema.sql")
    const migrationSQL = fs.readFileSync(migrationPath, "utf8")

    console.log("🔄 Running packages schema migration...")

    // Define the columns to add
    const columnsToAdd = [
      { name: "carrier", type: "TEXT" },
      { name: "recipient_email", type: "TEXT" },
      { name: "origin", type: "TEXT" },
      { name: "destination", type: "TEXT" },
      { name: "current_location", type: "TEXT" },
      { name: "estimated_delivery", type: "TIMESTAMP WITH TIME ZONE" },
      { name: "dimensions", type: "TEXT" },
      { name: "notes", type: "TEXT" },
      { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE SET NULL" }
    ]

    const results = []

    // Add each column individually
    for (const column of columnsToAdd) {
      try {
        const { error } = await admin.rpc("exec", {
          query: `ALTER TABLE packages ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`
        })

        if (error) {
          console.warn(`⚠️ Could not add column ${column.name}:`, error.message)
          results.push({ column: column.name, status: "failed", error: error.message })
        } else {
          console.log(`✅ Added column: ${column.name}`)
          results.push({ column: column.name, status: "success" })
        }
      } catch (err: any) {
        console.warn(`⚠️ Exception adding column ${column.name}:`, err.message)
        results.push({ column: column.name, status: "failed", error: err.message })
      }
    }

    // Update status constraint
    try {
      await admin.rpc("exec", {
        query: `
          ALTER TABLE packages DROP CONSTRAINT IF EXISTS packages_status_check;
          ALTER TABLE packages ADD CONSTRAINT packages_status_check
            CHECK (status IN (
              'pending', 'shipped', 'in_transit', 'out_for_delivery',
              'delivered', 'returned', 'cancelled', 'exception', 'failed_delivery'
            ));
        `
      })
      results.push({ operation: "status_constraint", status: "success" })
    } catch (err: any) {
      results.push({ operation: "status_constraint", status: "failed", error: err.message })
    }

    console.log("✅ Packages schema migration attempt completed!")

    return NextResponse.json({
      success: true,
      message: "Packages schema migration attempted",
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("❌ Migration API unexpected error:", error)
    return NextResponse.json({
      error: "Migration failed",
      message: error?.message || "Unknown error",
      success: false
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const admin = createAdminClient()

    // Check current schema
    const { data: columns, error } = await admin
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "packages")
      .order("ordinal_position")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const requiredColumns = [
      "carrier", "recipient_email", "origin", "destination",
      "current_location", "estimated_delivery", "notes", "dimensions", "user_id"
    ]

    const existingColumns = columns?.map(c => c.column_name) || []
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))

    return NextResponse.json({
      current_columns: columns || [],
      missing_columns: missingColumns,
      migration_needed: missingColumns.length > 0
    })

  } catch (error: any) {
    return NextResponse.json({
      error: "Schema check failed",
      message: error?.message || "Unknown error"
    }, { status: 500 })
  }
}
