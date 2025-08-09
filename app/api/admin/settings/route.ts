import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

const SettingsSchema = z.object({
  siteName: z.string().min(1),
  siteDescription: z.string().min(1),
  supportEmail: z.string().email(),
  enableNotifications: z.boolean(),
  enableSMS: z.boolean(),
  enableEmailAlerts: z.boolean(),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
}).partial()

export async function GET() {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("app_settings")
      .select("id, data, updated_at")
      .eq("id", "singleton")
      .maybeSingle()

    if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data: data?.data ?? null, updated_at: data?.updated_at ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const json = await req.json().catch(() => ({}))
    const parsed = SettingsSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const admin = createAdminClient()
    const payload = parsed.data

    const { data, error } = await admin
      .from("app_settings")
      .upsert({ id: "singleton", data: payload, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("id, data, updated_at")
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data: data?.data ?? null, updated_at: data?.updated_at ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
