"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type PackageStatus } from "@/components/ui/status-badge"
import { Package, Search, Truck, Inbox, MapPin, Plus, SlidersHorizontal } from 'lucide-react'
import { cn } from "@/lib/utils"

type PackageItem = {
  id: string
  carrier: string
  trackingNumber: string
  status: PackageStatus
  eta?: string
  updatedAt: string
  destination: string
}

type Stats = {
  total: number
  inTransit: number
  delivered: number
  exceptions: number
}

type Props = {
  userName?: string
  role?: "admin" | "user"
  stats?: Stats
  packages?: PackageItem[]
}

const defaultPackages: PackageItem[] = [
  {
    id: "1",
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    status: "in_transit",
    eta: "Aug 12",
    updatedAt: "2h ago",
    destination: "San Francisco, CA",
  },
  {
    id: "2",
    carrier: "USPS",
    trackingNumber: "9400 1000 0000 0000 0000 00",
    status: "out_for_delivery",
    eta: "Today",
    updatedAt: "15m ago",
    destination: "Austin, TX",
  },
  {
    id: "3",
    carrier: "DHL",
    trackingNumber: "JD014600003733960626",
    status: "delivered",
    eta: "Aug 6",
    updatedAt: "2d ago",
    destination: "New York, NY",
  },
  {
    id: "4",
    carrier: "FedEx",
    trackingNumber: "61299999999999999999",
    status: "exception",
    eta: "TBD",
    updatedAt: "1h ago",
    destination: "Seattle, WA",
  },
]

const defaultStats: Stats = {
  total: defaultPackages.length,
  inTransit: defaultPackages.filter(p => p.status === "in_transit" || p.status === "out_for_delivery").length,
  delivered: defaultPackages.filter(p => p.status === "delivered").length,
  exceptions: defaultPackages.filter(p => p.status === "exception").length,
}

export default function DashboardClient(props: Props = {}) {
  const {
    userName = "Alex",
    role = "admin",
    packages = defaultPackages,
    stats = defaultStats,
  } = props

  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<string>("all")
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    let items = packages
    if (tab === "open") {
      items = items.filter(p => p.status !== "delivered" && p.status !== "returned")
    } else if (tab === "delivered") {
      items = items.filter(p => p.status === "delivered")
    } else if (tab === "exceptions") {
      items = items.filter(p => p.status === "exception")
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter(
        p =>
          p.trackingNumber.toLowerCase().includes(q) ||
          p.carrier.toLowerCase().includes(q) ||
          p.destination.toLowerCase().includes(q),
      )
    }
    return items
  }, [packages, tab, query])

  return (
    <div className="relative z-10 space-y-8">
      {/* Premium gradient hero */}
      <div className="rounded-2xl border bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2">
                <Package className="h-6 w-6" aria-hidden="true" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/25">
                {role === "admin" ? "Admin" : "User"}
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back, {userName}</h1>
            <p className="mt-1 text-white/80">
              Track and manage your packages with real-time updates and smart filters.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="mr-2 h-5 w-5" /> Track package
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a tracking number</DialogTitle>
                  <DialogDescription>Paste a number; we’ll fetch status automatically.</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget as HTMLFormElement)
                    const n = (fd.get("tracking") as string) || ""
                    if (n) {
                      // In production, call your Server Action/Route Handler here.
                      setOpen(false)
                    }
                  }}
                  className="space-y-3"
                >
                  <Input name="tracking" placeholder="e.g. 1Z999AA10123456784" required />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              <SlidersHorizontal className="mr-2 h-5 w-5" /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total" value={stats.total} accent="from-slate-100 to-slate-50" icon={<Inbox className="h-5 w-5" />} />
        <StatCard title="In transit" value={stats.inTransit} accent="from-blue-100 to-blue-50" icon={<Truck className="h-5 w-5" />} />
        <StatCard title="Delivered" value={stats.delivered} accent="from-emerald-100 to-emerald-50" icon={<Package className="h-5 w-5" />} />
        <StatCard title="Exceptions" value={stats.exceptions} accent="from-rose-100 to-rose-50" icon={<MapPin className="h-5 w-5" />} />
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col-reverse items-stretch gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tracking, carrier, destination..."
            className="pl-9"
            aria-label="Search packages"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v)} className="w-full md:w-auto">
          <TabsList className="grid h-10 w-full grid-cols-4 md:w-auto md:auto-cols-auto md:grid-flow-col">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState onAdd={() => setOpen(true)} />
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="transition-all hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <span className="truncate font-medium">{item.trackingNumber}</span>
                      <Badge variant="outline" className="rounded-full">
                        {item.carrier}
                      </Badge>
                    </div>
                    <div className="mt-1 truncate text-sm text-muted-foreground">
                      {item.destination} • Updated {item.updatedAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:justify-end">
                  {item.eta && (
                    <span className="text-sm text-muted-foreground">
                      ETA <span className="font-medium text-foreground">{item.eta}</span>
                    </span>
                  )}
                  <StatusBadge status={item.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string
  value: number
  icon?: React.ReactNode
  accent?: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("border-b bg-gradient-to-b", accent)}>
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
          <Search className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">No packages found</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Try a different search or add your first tracking number to get real-time updates.
        </p>
        <div className="flex gap-2">
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" /> Track package
          </Button>
          <Button variant="outline">Import CSV</Button>
        </div>
      </CardContent>
    </Card>
  )
}
