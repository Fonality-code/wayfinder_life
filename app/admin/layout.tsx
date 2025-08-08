import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ensureProfileAndGetRole } from "@/lib/auth/role"
import { Button } from "@/components/ui/button"

// Ensure fresh role on every request.
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role } = await ensureProfileAndGetRole()

  if (!user) {
    redirect("/auth")
  }

  if (role !== "admin") {
    // Render 403 instead of redirecting back to prevent loops.
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-md w-full rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold mb-2">403 • Unauthorized</h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access the admin panel.
          </p>
        <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
