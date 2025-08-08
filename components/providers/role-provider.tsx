"use client"

import * as React from "react"

type RoleContextValue = {
  userId: string
  email: string | null
  displayName: string | null
  role: "admin" | "user" | null
}

const RoleContext = React.createContext<RoleContextValue | null>(null)

export function RoleProvider({
  value,
  children,
}: {
  value: RoleContextValue
  children: React.ReactNode
}) {
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = React.useContext(RoleContext)
  if (!ctx) {
    return { userId: "", email: null, displayName: null, role: null }
  }
  return ctx
}
