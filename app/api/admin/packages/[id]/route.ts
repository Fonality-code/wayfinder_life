import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

const UpdateSchema = z.object({
  tracking_number: z.string().min(3).optional(),
  sender_name: z.string().min(1).optional(),
  sender_address: z.string().min(1).optional(),
  recipient_name: z.string().min(1).optional(),
  recipient_address: z.string().min(1).optional(),
  package_type: z.string().min(1).optional(),
  weight: z.number().finite().nullable().optional(),
  status: z.enum(["pending", "in_transit", "delivered", "cancelled"]).optional(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const json = await req.json().catch(() => ({}))
    const parsed = UpdateSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("packages")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select("*")
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
    if (!auth.user || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const admin = createAdminClient()
    const { error } = await admin.from("packages").delete().eq("id", params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
