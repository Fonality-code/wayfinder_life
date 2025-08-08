import type React from "react"
import { redirect } from "next/navigation"
import { ensureProfileAndGetRole } from "@/lib/auth/role"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role } = await ensureProfileAndGetRole()

  if (!user) redirect("/auth")
  if (role === "admin") redirect("/admin")

  return <>{children}</>
}
