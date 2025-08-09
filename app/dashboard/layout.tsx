import type React from "react"
import { redirect } from "next/navigation"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role } = await getAuthenticatedUserWithRole()

  if (!user) redirect("/auth")


  return <>{children}</>
}
