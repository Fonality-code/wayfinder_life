import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

const BodySchema = z.object({
  full_name: z.string().min(0).max(200).nullable().optional(),
  role: z.enum(["admin", "user"]).optional(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const id = params.id
    const json = await req.json().catch(() => ({}))
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("profiles")
      .update({ ...parsed.data })
      .eq("id", id)
      .select("id,email,full_name,role,created_at")
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Prevent self-deletion
    if (params.id === auth.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    const admin = createAdminClient()

    // First delete from profiles table
    const { error: profileError } = await admin
      .from("profiles")
      .delete()
      .eq("id", params.id)

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

    // Then delete from auth.users (requires admin client with proper permissions)
    const { error: authError } = await admin.auth.admin.deleteUser(params.id)

    if (authError) {
      console.warn("Profile deleted but auth user deletion failed:", authError.message)
      // Still return success since profile was deleted
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
