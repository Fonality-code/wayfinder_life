"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!mounted) return
        if (user) {
          router.replace("/dashboard")
        } else {
          setChecking(false)
        }
      } catch {
        setChecking(false)
      }
    }
    check()
    return () => {
      mounted = false
    }
  }, [router, supabase])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-lg font-medium text-blue-700">Loading...</span>
        </div>
      </div>
    )
  }

  return <AuthForm />
}
