/**
 * Node.js script to read a user's role from Supabase using the service role key.
 * How to run in v0 Scripts:
 * - Ensure SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
 * - Optionally set USER_ID to target a different UUID.
 */
import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const userId =
  process.env.USER_ID || "8f0a2fa4-cf44-4c56-a64a-85ee53169cb9"

if (!url || !serviceKey) {
  console.error(
    "Missing Supabase envs. Require NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY."
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role,created_at")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    console.error("Query error:", error.message)
    process.exit(1)
  }

  if (!data) {
    console.log("Profile not found for id:", userId)
    return
  }

  console.log("Profile role result:", data)
}

main().catch((e) => {
  console.error("Unexpected error:", e)
  process.exit(1)
})
