import { redirect } from "next/navigation"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import EnhancedDashboardClient from "@/components/dashboard/enhanced-dashboard-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  const { user, role, profile } = await getAuthenticatedUserWithRole()

  if (!user) {
    redirect("/auth")
  }

  const displayName = user.displayName || profile?.full_name || null
  const email = profile?.email || user.email || null

  return (
    <EnhancedDashboardClient
      user={{
        id: user.id,
        email: email,
        full_name: displayName,
        avatar_url: null, // We can add this later if needed
      }}
      role={role || "user"}
      initialPackages={[]}
    />
  )
}
