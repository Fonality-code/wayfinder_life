"use client"

import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

let browserClient: SupabaseClient | null = null

/**
 * Browser Supabase client (singleton).
 * Do NOT pass a cookies option in the browser; @supabase/ssr uses document.cookie automatically. [^1][^2]
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  browserClient = createBrowserClient(url, anon)
  return browserClient
}
