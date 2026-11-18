"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { Switch } from "@/components/ui/switch"

export function ThemeModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )

  const darkMode = resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-medium">
        {darkMode ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
        Dark mode
      </span>
      <Switch
        checked={mounted ? darkMode : false}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
    </div>
  )
}
