import { redirect } from "next/navigation"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AdminDashboardClient from "@/components/admin/dashboard-stats"

export default async function AdminDashboard() {
  const { user, role } = await getAuthenticatedUserWithRole()

  if (!user) {
    redirect("/auth")
  }

  // IMPORTANT: Do NOT redirect non-admins to /dashboard here; render a 403.
  // This prevents a redirect loop if role evaluation is temporarily inconsistent.
  if (role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-xl">
          <Card className="bg-white">
            <CardHeader className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <CardTitle>Unauthorized</CardTitle>
              <CardDescription>Admin access is required to view this page.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild variant="secondary">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Sign in with a different account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <div className="space-y-8">
      <AdminDashboardClient />
    </div>
  )
}
