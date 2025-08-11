import { redirect } from "next/navigation"
import { ensureProfileAndGetRole } from "@/lib/auth/role"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProfilePage() {
  const { user, role, profile } = await ensureProfileAndGetRole()
  if (!user) redirect("/auth")

  const displayName = user.displayName
  const email = profile?.email ?? user.email ?? ""
  const resolvedRole = (role ?? "user") as "user" | "admin"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/80 backdrop-blur border-white/60">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Information from your account and role from the profiles table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Display name (from auth)</div>
              <div className="text-lg font-medium text-gray-900">{displayName ?? "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="text-lg font-medium text-gray-900">{email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Role (from profiles)</div>
              <Badge className={resolvedRole === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                {resolvedRole.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
