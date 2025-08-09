"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Edit, Search, Trash2, Package, Truck, CheckCircle, Clock, AlertTriangle, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { GradientCard } from "@/components/ui/gradient-card"
import type { Package as PackageType } from "@/lib/types"

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [viewingPackage, setViewingPackage] = useState<PackageType | null>(null)

  const pageSize = 20

  useEffect(() => {
    fetchPackages()
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    // Reset to first page when search/filter changes
    if (currentPage !== 1) {
      setCurrentPage(1)
    } else {
      fetchPackages()
    }
  }, [searchTerm, statusFilter])

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      })
      if (searchTerm.trim()) params.set("q", searchTerm.trim())
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/packages?${params}`, { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to fetch packages")

      setPackages(json.data || [])
      setTotalCount(json.count || 0)
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to fetch packages", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    const packageData = {
      tracking_number: formData.get("tracking_number") as string,
      sender_name: formData.get("sender_name") as string,
      sender_address: formData.get("sender_address") as string,
      recipient_name: formData.get("recipient_name") as string,
      recipient_address: formData.get("recipient_address") as string,
      package_type: formData.get("package_type") as string,
      weight: (formData.get("weight") as string)?.length
        ? Number.parseFloat(formData.get("weight") as string)
        : null,
      status: formData.get("status") as "pending" | "in_transit" | "delivered" | "cancelled",
    }

    try {
      let res: Response
      if (editingPackage) {
        res = await fetch(`/api/admin/packages/${editingPackage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(packageData),
        })
      } else {
        res = await fetch("/api/admin/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(packageData),
        })
      }

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to save package")

      toast({ title: "Success", description: `Package ${editingPackage ? "updated" : "created"} successfully` })
      setIsDialogOpen(false)
      setEditingPackage(null)
      await fetchPackages()
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Save failed", variant: "destructive" })
    }
  }

  const handleDelete = async (packageId: string) => {
    try {
      setIsDeleting(packageId)
      const res = await fetch(`/api/admin/packages/${packageId}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete package")

      toast({ title: "Success", description: "Package deleted successfully" })
      await fetchPackages()
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to delete package", variant: "destructive" })
    } finally {
      setIsDeleting(null)
    }
  }

  const openEditDialog = (pkg: PackageType) => {
    setEditingPackage(pkg)
    setIsDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "in_transit": return <Truck className="h-4 w-4" />
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "cancelled": return <AlertTriangle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "in_transit": return "bg-blue-100 text-blue-800"
      case "delivered": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-slate-100 text-slate-800"
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalCount)

  // Calculate stats
  const pendingCount = packages.filter(p => p.status === "pending").length
  const inTransitCount = packages.filter(p => p.status === "in_transit").length
  const deliveredCount = packages.filter(p => p.status === "delivered").length
  const cancelledCount = packages.filter(p => p.status === "cancelled").length

  const stats = [
    { title: "Total Packages", value: totalCount, icon: Package, color: "text-blue-600" },
    { title: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-600" },
    { title: "In Transit", value: inTransitCount, icon: Truck, color: "text-blue-600" },
    { title: "Delivered", value: deliveredCount, icon: CheckCircle, color: "text-green-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Package Management
          </h1>
          <p className="text-slate-600 mt-2">Track and manage all packages in your system</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingPackage(null)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {editingPackage ? "Edit Package" : "Create New Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage ? "Update package information" : "Add a new package to the tracking system"}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking_number">Tracking Number *</Label>
                  <Input
                    id="tracking_number"
                    name="tracking_number"
                    defaultValue={editingPackage?.tracking_number}
                    placeholder="e.g., 1Z999AA10123456784"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingPackage?.status || "pending"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Sender Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender_name">Sender Name *</Label>
                    <Input
                      id="sender_name"
                      name="sender_name"
                      defaultValue={editingPackage?.sender_name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender_address">Sender Address *</Label>
                    <Input
                      id="sender_address"
                      name="sender_address"
                      defaultValue={editingPackage?.sender_address}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Recipient Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient_name">Recipient Name *</Label>
                    <Input
                      id="recipient_name"
                      name="recipient_name"
                      defaultValue={editingPackage?.recipient_name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient_address">Recipient Address *</Label>
                    <Input
                      id="recipient_address"
                      name="recipient_address"
                      defaultValue={editingPackage?.recipient_address}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type *</Label>
                  <Input
                    id="package_type"
                    name="package_type"
                    defaultValue={editingPackage?.package_type}
                    placeholder="e.g., Document, Electronics, Fragile"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    defaultValue={editingPackage?.weight ?? ""}
                    placeholder="0.5"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                {editingPackage ? "Update Package" : "Create Package"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <GradientCard key={stat.title} gradient="blue" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </GradientCard>
        ))}
      </div>

      {/* Packages Table */}
      <GradientCard gradient="blue" className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by tracking number, sender, or recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Directory
            </div>
            <div className="text-sm font-normal text-slate-500">
              Showing {startIndex}-{endIndex} of {totalCount}
            </div>
          </CardTitle>
          <CardDescription>Monitor and manage all packages</CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking Number</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type & Weight</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg.id} className="hover:bg-white/50">
                        <TableCell>
                          <div className="font-mono text-sm font-medium">{pkg.tracking_number}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{pkg.sender_name}</span>
                              <span className="text-slate-400 mx-2">→</span>
                              <span className="font-medium">{pkg.recipient_name}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {pkg.sender_address} → {pkg.recipient_address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pkg.status)}>
                            {getStatusIcon(pkg.status)}
                            <span className="ml-1 capitalize">{pkg.status.replace("_", " ")}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{pkg.package_type}</div>
                            {pkg.weight && (
                              <div className="text-xs text-slate-500">{pkg.weight}kg</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {new Date(pkg.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingPackage(pkg)}
                              className="hover:bg-green-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(pkg)}
                              className="hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-50 text-red-600 hover:text-red-700"
                                  disabled={isDeleting === pkg.id}
                                >
                                  {isDeleting === pkg.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Package</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete package "{pkg.tracking_number}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(pkg.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                        if (pageNum > totalPages) return null

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(pageNum)
                              }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </GradientCard>

      {/* Package Details Dialog */}
      <Dialog open={!!viewingPackage} onOpenChange={(open) => !open && setViewingPackage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Package Details
            </DialogTitle>
          </DialogHeader>
          {viewingPackage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Tracking Number</Label>
                  <p className="font-mono text-lg">{viewingPackage.tracking_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(viewingPackage.status)}>
                      {getStatusIcon(viewingPackage.status)}
                      <span className="ml-1 capitalize">{viewingPackage.status.replace("_", " ")}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Sender</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-slate-600">Name</Label>
                      <p>{viewingPackage.sender_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Address</Label>
                      <p className="text-sm">{viewingPackage.sender_address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Recipient</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-slate-600">Name</Label>
                      <p>{viewingPackage.recipient_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Address</Label>
                      <p className="text-sm">{viewingPackage.recipient_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-slate-600">Package Type</Label>
                  <p>{viewingPackage.package_type}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Weight</Label>
                  <p>{viewingPackage.weight ? `${viewingPackage.weight}kg` : "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Created</Label>
                  <p>{new Date(viewingPackage.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
