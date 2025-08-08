import "server-only"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

/**
 * Cookie-bound Supabase server client (same project as admin client).
 * Uses consistent environment variables for both public and server configurations.
 */
export async function createClient() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            )
          } catch {
            // Next.js may throw in dev previews; ignore to avoid hard failures.
          }
        },
      },
    }
  )

  return supabase
}
