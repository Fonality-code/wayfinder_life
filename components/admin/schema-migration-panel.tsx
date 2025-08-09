"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Database, PlayCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SchemaMigrationPanel() {
  const [isChecking, setIsChecking] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const [schemaInfo, setSchemaInfo] = useState<any>(null)

  const checkSchema = async () => {
    try {
      setIsChecking(true)
      const response = await fetch("/api/admin/migrate-schema")
      const data = await response.json()

      if (response.ok) {
        setSchemaInfo(data)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to check schema",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check schema",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const runMigration = async () => {
    try {
      setIsMigrating(true)
      const response = await fetch("/api/admin/migrate-schema", { method: "POST" })
      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Migration Complete",
          description: data.message,
        })
        // Refresh schema info
        checkSchema()
      } else {
        toast({
          title: "Migration Failed",
          description: data.error || "Migration failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Migration failed",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema Migration
          </CardTitle>
          <CardDescription>
            Update the packages table schema to support enhanced tracking features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={checkSchema}
              variant="outline"
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Check Schema"}
            </Button>
            <Button
              onClick={runMigration}
              disabled={isMigrating || !schemaInfo?.migration_needed}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              {isMigrating ? "Running..." : "Run Migration"}
            </Button>
          </div>

          {schemaInfo && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {schemaInfo.migration_needed ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-700">Migration needed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">Schema is up to date</span>
                  </>
                )}
              </div>

              {schemaInfo.missing_columns?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Missing columns:</p>
                  <div className="flex flex-wrap gap-1">
                    {schemaInfo.missing_columns.map((column: string) => (
                      <Badge key={column} variant="outline" className="text-xs">
                        {column}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Current columns ({schemaInfo.current_columns?.length || 0}):
                </p>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {schemaInfo.current_columns?.map((col: any) => (
                    <Badge key={col.column_name} variant="secondary" className="text-xs">
                      {col.column_name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-800 mb-1">What this migration adds:</p>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• <code>carrier</code> - Package carrier (UPS, FedEx, etc.)</li>
              <li>• <code>recipient_email</code> - Email for package recipient</li>
              <li>• <code>origin</code> & <code>destination</code> - Package locations</li>
              <li>• <code>current_location</code> - Live tracking location</li>
              <li>• <code>estimated_delivery</code> - Expected delivery date</li>
              <li>• <code>notes</code> & <code>dimensions</code> - Additional package info</li>
              <li>• Enhanced status options for better tracking</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
