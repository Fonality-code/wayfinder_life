/**
 * Node.js script to query a user's role from public.profiles.
 * Uses the Neon serverless driver and the POSTGRES_* env vars provided in this workspace.
 *
 * How to run:
 * - Ensure POSTGRES_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING) is set.
 * - Optionally set USER_ID to override the default UUID.
 * - Execute this script from v0's Scripts runner.
 *
 * Integration note: Neon connections should use the @neondatabase/serverless package [^2].
 */
import { neon } from "@neondatabase/serverless"

const connection =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING

if (!connection) {
  console.error(
    "Missing POSTGRES_URL/POSTGRES_PRISMA_URL/POSTGRES_URL_NON_POOLING environment variable."
  )
  process.exit(1)
}

const sql = neon(connection)

const USER_ID =
  process.env.USER_ID || "8f0a2fa4-cf44-4c56-a64a-85ee53169cb9"

async function main() {
  try {
    const rows = await sql<{
      id: string
      email: string | null
      role: string | null
      created_at: string | null
    }[]>`
      SELECT id, email, role, created_at
      FROM public.profiles
      WHERE id = ${USER_ID}
    `

    if (rows.length === 0) {
      console.log(
        `No profile found for id=${USER_ID}. Ensure the row exists in public.profiles.`
      )
      return
    }

    console.log("Profile role result:", rows[0])
  } catch (err) {
    console.error("Error querying role:", err)
    process.exit(1)
  }
}

main()
