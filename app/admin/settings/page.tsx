"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield, Bell, Globe, Database, Key } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { GradientCard } from "@/components/ui/gradient-card"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Wayfinder",
    siteDescription: "Advanced Package Tracking Platform",
    supportEmail: "support@wayfinder.com",
    enableNotifications: true,
    enableSMS: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
  })

  const handleSaveGeneral = async (formData: FormData) => {
    const newSettings = {
      ...settings,
      siteName: formData.get("siteName") as string,
      siteDescription: formData.get("siteDescription") as string,
      supportEmail: formData.get("supportEmail") as string,
    }
    setSettings(newSettings)
    toast({
      title: "Success",
      description: "General settings saved successfully",
    })
  }

  const handleSaveSecurity = async (formData: FormData) => {
    toast({
      title: "Success",
      description: "Security settings updated successfully",
    })
  }

  const handleSaveNotifications = async () => {
    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          System Settings
        </h1>
        <p className="text-slate-600 mt-2">Configure your Wayfinder platform settings</p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GradientCard gradient="blue" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic configuration for your platform</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <form action={handleSaveGeneral} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" name="siteName" defaultValue={settings.siteName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" name="supportEmail" type="email" defaultValue={settings.supportEmail} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    defaultValue={settings.siteDescription}
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-slate-500">Temporarily disable public access</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Registration</Label>
                      <p className="text-sm text-slate-500">Allow new users to register</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Save General Settings
                </Button>
              </form>
            </CardContent>
          </GradientCard>
        </TabsContent>

        <TabsContent value="security">
          <GradientCard gradient="purple" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <form action={handleSaveSecurity} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Email Verification</Label>
                      <p className="text-sm text-slate-500">
                        Users must verify their email before accessing the platform
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" name="sessionTimeout" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input id="maxLoginAttempts" name="maxLoginAttempts" type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedDomains">Allowed Email Domains (optional)</Label>
                  <Textarea id="allowedDomains" name="allowedDomains" placeholder="example.com, company.org" rows={3} />
                </div>
                <Button type="submit" className="w-full">
                  Save Security Settings
                </Button>
              </form>
            </CardContent>
          </GradientCard>
        </TabsContent>

        <TabsContent value="notifications">
          <GradientCard gradient="green" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Notifications</Label>
                      <p className="text-sm text-slate-500">Master switch for all notifications</p>
                    </div>
                    <Switch
                      checked={settings.enableNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-slate-500">Send SMS alerts for important updates</p>
                    </div>
                    <Switch
                      checked={settings.enableSMS}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableSMS: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-slate-500">Send email notifications for package updates</p>
                    </div>
                    <Switch
                      checked={settings.enableEmailAlerts}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableEmailAlerts: checked })}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveNotifications} className="w-full">
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </GradientCard>
        </TabsContent>

        <TabsContent value="integrations">
          <GradientCard gradient="orange" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>Configure third-party integrations and API settings</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GradientCard gradient="blue" className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Database</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Provider: Supabase</p>
                      <p>Status: Connected</p>
                      <p>Last Backup: 2 hours ago</p>
                      <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                        Manage
                      </Button>
                    </div>
                  </GradientCard>

                  <GradientCard gradient="green" className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold">API Keys</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Public Key: wf_pk_...</p>
                      <p>Secret Key: wf_sk_...</p>
                      <p>Rate Limit: 1000/hour</p>
                      <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                        Regenerate
                      </Button>
                    </div>
                  </GradientCard>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Webhook Endpoints</h3>
                  <div className="space-y-2">
                    <Input placeholder="https://your-app.com/webhooks/wayfinder" />
                    <Button variant="outline" className="w-full bg-transparent">
                      Add Webhook
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
