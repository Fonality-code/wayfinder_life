import type React from "react"

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Wayfinder Debug Console
          </h1>
          <p className="text-gray-600">
            Diagnose authentication and role detection issues
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
