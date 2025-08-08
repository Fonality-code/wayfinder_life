import { redirect } from "next/navigation"
import { getUserAndRole } from "@/lib/auth/get-user-with-role"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Route, TrendingUp, Users, Lock } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const { user, role } = await getUserAndRole()

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

  // Example dashboard content (same as before)
  // You can keep your existing admin UI here.
  // Placeholder stats; replace with your real queries if needed.
  const stats = [
    { title: "Total Packages", value: 0, icon: Package, description: "Packages in the system" },
    { title: "Active Routes", value: 0, icon: Route, description: "Available shipping routes" },
    { title: "In Transit", value: 0, icon: TrendingUp, description: "Packages currently shipping" },
    { title: "Delivered Today", value: 0, icon: Users, description: "Packages delivered today" },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Wayfinder Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your advanced package tracking admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
