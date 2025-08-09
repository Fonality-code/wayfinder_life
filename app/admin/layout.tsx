import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getAuthenticatedUserWithRole } from "@/lib/auth/debug-auth"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  Route,
  Users,
  Settings,
  MapPin,
  Bell,
  LogOut,
  Menu
} from "lucide-react"
import { AdminSidebarContent } from "@/components/admin/admin-sidebar"

// Ensure fresh role on every request.
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role } = await getAuthenticatedUserWithRole()

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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AdminSidebarContent />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
                  <p className="text-sm text-slate-600">Manage your Wayfinder platform</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-slate-50">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
