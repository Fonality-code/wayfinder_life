import "server-only"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const auth = await getAuthenticatedUserWithRole()
    if (!auth.user || auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const url = new URL(req.url)
    const q = url.searchParams.get("q")?.trim()
    const role = url.searchParams.get("role")?.trim()
    const page = Number(url.searchParams.get("page") || 1)
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") || 50), 200)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const admin = createAdminClient()

    let query = admin
      .from("profiles")
      .select("id,email,full_name,role,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    // Apply search filter
    if (q) {
      query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
    }

    // Apply role filter
    if (role && role !== "all") {
      query = query.eq("role", role)
    }

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data: data ?? [], count: count ?? 0 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
