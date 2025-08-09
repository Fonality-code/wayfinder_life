"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AuthDebugger() {
  const [authState, setAuthState] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      // Check auth status
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      setAuthState({
        user,
        error: userError?.message,
        isAuthenticated: !!user && !userError
      })

      // If authenticated, try to get role from API
      if (user && !userError) {
        try {
          const response = await fetch('/api/auth/role')
          const roleData = await response.json()
          setProfileData(roleData)
        } catch (err: any) {
          setProfileData({ error: err.message })
        }
      }
    } catch (error: any) {
      setAuthState({
        user: null,
        error: error.message,
        isAuthenticated: false
      })
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p>Loading authentication status...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Authentication Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Authentication Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={authState?.isAuthenticated ? "default" : "destructive"}>
                  {authState?.isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>

              {authState?.user && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>User ID:</strong> {authState.user.id}</p>
                  <p><strong>Email:</strong> {authState.user.email}</p>
                  <p><strong>Created:</strong> {new Date(authState.user.created_at).toLocaleString()}</p>
                </div>
              )}

              {authState?.error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                  <strong>Auth Error:</strong> {authState.error}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Role Detection</h3>
            {profileData ? (
              <div className="space-y-2">
                {profileData.error ? (
                  <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                    <strong>Role API Error:</strong> {profileData.error}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                    <p><strong>Role:</strong> <Badge>{profileData.role || 'null'}</Badge></p>
                    <p><strong>Profile Role:</strong> {profileData.profileRole || 'null'}</p>
                    <p><strong>Display Name:</strong> {profileData.displayName || 'null'}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Not available (user not authenticated)</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={checkAuthStatus} variant="outline" size="sm">
              Refresh Status
            </Button>
            {authState?.isAuthenticated && (
              <Button onClick={handleSignOut} variant="destructive" size="sm">
                Sign Out
              </Button>
            )}
            {!authState?.isAuthenticated && (
              <Button asChild size="sm">
                <a href="/auth">Sign In</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Quick Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <a href="/dashboard/profile" target="_blank">Test Profile Page</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <a href="/admin" target="_blank">Test Admin Access</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <a href="/api/auth/role" target="_blank">Test Role API</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <a href="/api/debug/profiles" target="_blank">Test Profiles API</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
