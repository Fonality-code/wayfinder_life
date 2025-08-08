import "server-only"
import { createClient } from "@/lib/supabase/server"

export type AppRole = "admin" | "user"

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  role: AppRole | null
}

type EnsureResult = {
  user: { id: string; email: string | null; displayName: string | null } | null
  role: AppRole | null
  profile: ProfileRow | null
}

/**
 * Server-only helper to call Supabase REST with the service role key.
 * This bypasses RLS and must never be exposed to the client.
 */
async function rest<T>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error: string | null }> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    let err: string | null = null
    try {
      const body = await res.text()
      err = body
    } catch {
      err = res.statusText
    }
    return { ok: false, status: res.status, data: null, error: err }
  }

  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const data = (isJson ? await res.json() : (null as any)) as T
  return { ok: true, status: res.status, data, error: null }
}

/**
 * Single source of truth for role resolution:
 * - Reads auth user via cookie-bound server client
 * - Uses Supabase REST (service role) to read/write public.profiles
 * - Never overwrites an existing role
 */
export async function ensureProfileAndGetRole(): Promise<EnsureResult> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return { user: null, role: null, profile: null }
  }

  const displayName: string | null =
    (user.user_metadata as any)?.name ??
    (user.user_metadata as any)?.full_name ??
    (user.user_metadata as any)?.user_name ??
    null

  // 1) Try read by id
  {
    const { ok, data, error } = await rest<ProfileRow[]>(
      `/rest/v1/profiles?select=id,email,full_name,role&id=eq.${encodeURIComponent(
        user.id
      )}`
    )
    if (ok && data && data.length > 0) {
      const row = data[0]
      return {
        user: { id: user.id, email: user.email ?? null, displayName },
        role: (row.role as AppRole) ?? "user",
        profile: row,
      }
    }
  }

  // 2) Fallback read by email (covers legacy rows keyed by email)
  if (user.email) {
    const { ok, data } = await rest<ProfileRow[]>(
      `/rest/v1/profiles?select=id,email,full_name,role&email=eq.${encodeURIComponent(
        user.email
      )}`
    )
    if (ok && data && data.length > 0) {
      const row = data[0]
      return {
        user: { id: user.id, email: user.email ?? null, displayName },
        role: (row.role as AppRole) ?? "user",
        profile: row,
      }
    }
  }

  // 3) Insert baseline if truly missing (first login path)
  {
    const { ok } = await rest<ProfileRow[]>(`/rest/v1/profiles`, {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        full_name: displayName,
        role: "user",
      }),
    })

    // Re-read by id whether insert succeeded (handles concurrent insert)
    const { ok: ok2, data: after } = await rest<ProfileRow[]>(
      `/rest/v1/profiles?select=id,email,full_name,role&id=eq.${encodeURIComponent(
        user.id
      )}`
    )

    if (ok2 && after && after.length > 0) {
      const row = after[0]
      return {
        user: { id: user.id, email: user.email ?? null, displayName },
        role: (row.role as AppRole) ?? "user",
        profile: row,
      }
    }
  }

  // If everything failed, return safe defaults (UI stays functional)
  return {
    user: { id: user.id, email: user.email ?? null, displayName },
    role: "user",
    profile: null,
  }
}
