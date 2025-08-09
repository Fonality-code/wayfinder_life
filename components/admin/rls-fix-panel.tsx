"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function RlsFixPanel() {
  const [isFixing, setIsFixing] = useState(false)
  const [fixResult, setFixResult] = useState<any>(null)

  const handleFixRls = async () => {
    try {
      setIsFixing(true)
      setFixResult(null)

      const response = await fetch("/api/admin/fix-rls", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      const data = await response.json()

      if (response.ok) {
        setFixResult(data)
        toast({
          title: "RLS Fix Complete",
          description: `Successfully executed ${data.summary?.successful || 0} operations`,
        })
      } else {
        throw new Error(data.error || "Failed to fix RLS")
      }
    } catch (error: any) {
      console.error("RLS fix error:", error)
      toast({
        title: "RLS Fix Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Fix RLS Recursion Issue
        </CardTitle>
        <CardDescription>
          Resolve "infinite recursion detected in policy for relation 'profiles'" error
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This issue occurs when RLS policies on the profiles table reference themselves.
            The fix simplifies policies to avoid circular dependencies.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium">What this fix does:</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Removes recursive admin role checks from RLS policies</li>
            <li>• Simplifies profiles table policies to only allow self-access</li>
            <li>• Makes other tables publicly readable (admin operations use server-side controls)</li>
            <li>• Maintains security through server-side admin client usage</li>
          </ul>
        </div>

        <Button
          onClick={handleFixRls}
          disabled={isFixing}
          className="w-full"
        >
          {isFixing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Applying Fix...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Fix RLS Recursion
            </>
          )}
        </Button>

        {fixResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Fix completed successfully!</p>
                <div className="text-sm">
                  <p>Total operations: {fixResult.summary?.total}</p>
                  <p>Successful: {fixResult.summary?.successful}</p>
                  <p>Expected failures: {fixResult.summary?.expected_failures}</p>
                  {fixResult.summary?.failed > 0 && (
                    <p className="text-red-600">Unexpected failures: {fixResult.summary?.failed}</p>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded">
          <p className="font-medium mb-1">Alternative manual fix:</p>
          <p>If the automated fix fails, you can run the SQL script manually:</p>
          <code className="text-xs">scripts/fix-rls-recursion-final.sql</code>
        </div>
      </CardContent>
    </Card>
  )
}
