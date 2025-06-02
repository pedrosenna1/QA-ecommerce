"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bug } from "lucide-react"
import { useBugMode } from "@/context/bug-mode-context"

export default function BugModeToggle() {
  const { bugMode, toggleBugMode } = useBugMode()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-2">
      <Bug className={`h-5 w-5 ${bugMode ? "text-red-500" : "text-gray-400"}`} />
      <Switch id="bug-mode" checked={bugMode} onCheckedChange={toggleBugMode} data-testid="bug-mode-toggle" />
      <Label htmlFor="bug-mode" className="cursor-pointer">
        Bug Mode
      </Label>
    </div>
  )
}
