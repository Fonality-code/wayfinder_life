import { redirect } from "next/navigation"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import TrackingClient from "@/components/dashboard/tracking-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TrackPackagePage() {
  const { user } = await getAuthenticatedUserWithRole()

  if (!user) {
    redirect("/auth")
  }

  return <TrackingClient />
}
