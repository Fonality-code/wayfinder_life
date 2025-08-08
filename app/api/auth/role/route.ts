import "server-only"
import { NextResponse } from "next/server"
import { ensureProfileAndGetRole } from "@/lib/auth/role"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const { user, role, profile } = await ensureProfileAndGetRole()
  if (!user) return NextResponse.json({ role: null }, { status: 401 })

  return NextResponse.json(
    {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role,
      profileRole: profile?.role ?? null,
      profileId: profile?.id ?? null,
      supabaseUrlUsed: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
