"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Package } from "@/lib/types"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      })
    } else {
      setPackages(data || [])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (formData: FormData) => {
    const packageData = {
      tracking_number: formData.get("tracking_number") as string,
      sender_name: formData.get("sender_name") as string,
      sender_address: formData.get("sender_address") as string,
      recipient_name: formData.get("recipient_name") as string,
      recipient_address: formData.get("recipient_address") as string,
      package_type: formData.get("package_type") as string,
      weight: Number.parseFloat(formData.get("weight") as string) || null,
      status: formData.get("status") as string,
    }

    let error
    if (editingPackage) {
      const { error: updateError } = await supabase
        .from("packages")
        .update({ ...packageData, updated_at: new Date().toISOString() })
        .eq("id", editingPackage.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from("packages").insert([packageData])
      error = insertError
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Package ${editingPackage ? "updated" : "created"} successfully`,
      })
      setIsDialogOpen(false)
      setEditingPackage(null)
      fetchPackages()
    }
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Wayfinder Packages</h1>
          <p className="text-muted-foreground">Manage all packages in the system</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPackage(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
              <DialogDescription>
                {editingPackage ? "Update package information" : "Create a new package entry"}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input
                    id="tracking_number"
                    name="tracking_number"
                    defaultValue={editingPackage?.tracking_number}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type</Label>
                  <Input id="package_type" name="package_type" defaultValue={editingPackage?.package_type} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_name">Sender Name</Label>
                  <Input id="sender_name" name="sender_name" defaultValue={editingPackage?.sender_name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_name">Recipient Name</Label>
                  <Input
                    id="recipient_name"
                    name="recipient_name"
                    defaultValue={editingPackage?.recipient_name}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_address">Sender Address</Label>
                <Input
                  id="sender_address"
                  name="sender_address"
                  defaultValue={editingPackage?.sender_address}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient_address">Recipient Address</Label>
                <Input
                  id="recipient_address"
                  name="recipient_address"
                  defaultValue={editingPackage?.recipient_address}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.01" defaultValue={editingPackage?.weight} />
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
              <Button type="submit" className="w-full">
                {editingPackage ? "Update Package" : "Create Package"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
          <CardDescription>{packages.length} packages in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.tracking_number}</TableCell>
                    <TableCell>{pkg.sender_name}</TableCell>
                    <TableCell>{pkg.recipient_name}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[pkg.status]}>{pkg.status.replace("_", " ").toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{new Date(pkg.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPackage(pkg)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
