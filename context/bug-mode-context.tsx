"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface BugModeContextType {
  bugMode: boolean
  toggleBugMode: () => void
}

const BugModeContext = createContext<BugModeContextType | undefined>(undefined)

export function BugModeProvider({ children }: { children: ReactNode }) {
  const [bugMode, setBugMode] = useState(false)

  const toggleBugMode = () => {
    setBugMode((prev) => !prev)
  }

  return <BugModeContext.Provider value={{ bugMode, toggleBugMode }}>{children}</BugModeContext.Provider>
}

export function useBugMode() {
  const context = useContext(BugModeContext)
  if (context === undefined) {
    throw new Error("useBugMode must be used within a BugModeProvider")
  }
  return context
}
