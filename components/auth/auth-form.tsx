"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthForm() {
  const supabase = createClient()
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function afterAuthRedirect() {
    // Ensure profile exists, then route user to dashboard
    try {
      const response = await fetch("/api/profile/ensure", { method: "POST" })
      if (!response.ok) {
        console.warn("Failed to ensure profile:", response.statusText)
      }
    } catch (error) {
      console.warn("Failed to ensure profile:", error)
      // Non-blocking - continue with redirect
    }
    router.replace("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
      await afterAuthRedirect()
    } catch (err: any) {
      setError(err?.message || "Authentication failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur border-white/60">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Access your package tracking dashboard."
              : "Sign up to start tracking your packages."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600" disabled={loading}>
              {loading ? (mode === "signin" ? "Signing in..." : "Creating account...") : (mode === "signin" ? "Sign in" : "Sign up")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {mode === "signin" ? (
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                Need an account? Sign up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-blue-600 hover:underline"
              >
                Have an account? Sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
