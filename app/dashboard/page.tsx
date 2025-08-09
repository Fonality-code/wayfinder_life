import { redirect } from "next/navigation"
import { getUserAndRole } from "@/lib/auth/get-user-with-role"
import DashboardClient from "@/components/dashboard/dashboard-client"

type Package = {
  id: string
  tracking_number: string
  status: string
  current_location: string
  destination: string
  estimated_delivery: string
  created_at: string
}

export default async function DashboardPage() {
  const { user, role } = await getUserAndRole()

  if (!user) {
    redirect("/auth")
  }


  // Load packages for this user using the normal server client inside the client component
  // or keep it server-side here and pass via props depending on your existing implementation.
  // Here we assume DashboardClient accepts these user fields and loads data itself or via props.
  const displayName =
    (user.user_metadata as any)?.name ??
    (user.user_metadata as any)?.full_name ??
    (user.user_metadata as any)?.user_name ??
    null

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email ?? null,
        full_name: displayName ?? null,
        avatar_url: (user.user_metadata as any)?.avatar_url ?? null,
      }}
      initialPackages={[] as Package[]}
    />
  )
}
