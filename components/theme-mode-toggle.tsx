"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ThemeModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const darkMode = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-medium">
        {darkMode ? <Moon className="size-4" /> : <Sun className="size-4" />}
        Dark mode
      </span>

      <Switch
        checked={darkMode}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
    </div>
  );
}
