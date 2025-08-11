import { redirect } from "next/navigation"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import AddPackageClient from "@/components/dashboard/add-package-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AddPackagePage() {
  const { user } = await getAuthenticatedUserWithRole()

  if (!user) {
    redirect("/auth")
  }

  return <AddPackageClient />
}
