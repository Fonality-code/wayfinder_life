import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Creates a new Supabase admin client using the Service Role key.
 * Note: This bypasses RLS. Never expose this in client components.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable for admin client.")
  }
  if (!serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable for admin client.")
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { "X-Client-Info": "wayfinder-admin-client" },
    },
  })
}

/**
 * Returns a memoized Supabase admin client.
 * Ensures a single instance is reused across the server runtime.
 */
let adminClientSingleton: SupabaseClient | null = null
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClientSingleton) {
    adminClientSingleton = createAdminClient()
  }
  return adminClientSingleton
}
