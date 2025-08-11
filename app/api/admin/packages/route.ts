import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

const PackageSchema = z.object({
  tracking_number: z.string().min(3),
  sender_name: z.string().min(1),
  sender_address: z.string().min(1),
  recipient_name: z.string().min(1),
  recipient_address: z.string().min(1),
  package_type: z.string().min(1),
  weight: z.number().finite().nullable().optional(),
  status: z.enum(["pending", "in_transit", "delivered", "cancelled"]).default("pending"),
  carrier: z.string().min(1).optional(),
  notes: z.string().optional(),
  route_id: z.string().uuid().optional(),
})

export async function GET(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const url = new URL(req.url)
    const q = url.searchParams.get("q")?.trim()
    const page = Number(url.searchParams.get("page") || 1)
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") || 50), 200)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const admin = createAdminClient()
    let query = admin
      .from("packages")
      .select(`
        *,
        route:routes!packages_route_id_fkey(
          id,
          name,
          origin,
          destination,
          estimated_duration_hours,
          origin_lat,
          origin_lng,
          destination_lat,
          destination_lng,
          waypoints,
          color
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (q) {
      query = query.or(
        `tracking_number.ilike.%${q}%,sender_name.ilike.%${q}%,recipient_name.ilike.%${q}%`
      )
    }

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data: data ?? [], count: count ?? 0 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const json = await req.json()
    const parsed = PackageSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("packages")
      .insert([{ ...parsed.data }])
      .select("*")
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
