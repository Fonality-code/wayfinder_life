"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Plus, Send, Settings, Mail, MessageSquare, Smartphone } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { GradientCard } from "@/components/ui/gradient-card"

interface Notification {
  id: string
  title: string
  message: string
  type: "email" | "sms" | "push"
  status: "sent" | "pending" | "failed"
  recipients: number
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Package Delivered - TRK001234567",
      message: "Your package has been delivered successfully to 123 Main St.",
      type: "email",
      status: "sent",
      recipients: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Delivery Delay Alert",
      message: "Your package delivery has been delayed due to weather conditions.",
      type: "sms",
      status: "sent",
      recipients: 5,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSendNotification = async (formData: FormData) => {
    const notificationData = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      type: formData.get("type") as "email" | "sms" | "push",
      status: "sent" as const,
      recipients: Math.floor(Math.random() * 100) + 1,
      created_at: new Date().toISOString(),
    }

    setNotifications([notificationData, ...notifications])
    setIsDialogOpen(false)
    toast({
      title: "Success",
      description: "Notification sent successfully",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const stats = [
    {
      title: "Total Sent",
      value: notifications.filter((n) => n.status === "sent").length,
      icon: Send,
      color: "text-green-600",
    },
    {
      title: "Email Notifications",
      value: notifications.filter((n) => n.type === "email").length,
      icon: Mail,
      color: "text-blue-600",
    },
    {
      title: "SMS Notifications",
      value: notifications.filter((n) => n.type === "sms").length,
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Push Notifications",
      value: notifications.filter((n) => n.type === "push").length,
      icon: Smartphone,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-slate-600 mt-2">Manage and send notifications to users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send New Notification</DialogTitle>
              <DialogDescription>Create and send a notification to users</DialogDescription>
            </DialogHeader>
            <form action={handleSendNotification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Notification title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Notification message" rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Send Notification
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <GradientCard key={index} gradient="blue" className="p-6">
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

      {/* Main Content */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <GradientCard gradient="blue" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription>{notifications.length} notifications sent</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id} className="hover:bg-white/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-slate-500 truncate max-w-xs">{notification.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{notification.recipients}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(notification.status)}>
                            {notification.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(notification.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </GradientCard>
        </TabsContent>

        <TabsContent value="settings">
          <GradientCard gradient="purple" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences and templates</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GradientCard gradient="blue" className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Email Settings</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>SMTP Server: smtp.wayfinder.com</p>
                      <p>Port: 587</p>
                      <p>Encryption: TLS</p>
                      <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                        Configure
                      </Button>
                    </div>
                  </GradientCard>

                  <GradientCard gradient="green" className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold">SMS Settings</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Provider: Twilio</p>
                      <p>From: +1-555-WAYFIND</p>
                      <p>Status: Active</p>
                      <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                        Configure
                      </Button>
                    </div>
                  </GradientCard>

                  <GradientCard gradient="orange" className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="h-6 w-6 text-orange-600" />
                      <h3 className="font-semibold">Push Settings</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Provider: Firebase</p>
                      <p>iOS: Configured</p>
                      <p>Android: Configured</p>
                      <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                        Configure
                      </Button>
                    </div>
                  </GradientCard>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
