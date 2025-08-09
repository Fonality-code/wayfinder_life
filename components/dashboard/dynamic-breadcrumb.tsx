"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Package, MapPin, Plus, User, HelpCircle } from "lucide-react"

const pathConfig: Record<string, { title: string; icon: React.ComponentType<any> }> = {
  "/dashboard": { title: "Dashboard", icon: Home },
  "/dashboard/track": { title: "Track Package", icon: MapPin },
  "/dashboard/add": { title: "Add Package", icon: Plus },
  "/dashboard/profile": { title: "Profile", icon: User },
  "/help": { title: "Help", icon: HelpCircle },
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs = []

  // Always start with dashboard
  if (pathname !== "/dashboard") {
    breadcrumbs.push({
      href: "/dashboard",
      title: "Dashboard",
      icon: Home
    })
  }

  // Add current page if it's not dashboard
  if (pathname !== "/dashboard" && pathConfig[pathname]) {
    const config = pathConfig[pathname]
    breadcrumbs.push({
      href: pathname,
      title: config.title,
      icon: config.icon,
      isLast: true
    })
  }

  if (breadcrumbs.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  <crumb.icon className="h-4 w-4" />
                  {crumb.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href} className="flex items-center gap-1">
                  <crumb.icon className="h-4 w-4" />
                  {crumb.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
