import { Sparkles } from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

export function ProfileAppearance() {
  return (
    <Reveal>
      <section
        aria-labelledby="appearance-heading"
        className="overflow-hidden rounded-2xl border bg-card shadow-sm"
      >
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2
              id="appearance-heading"
              className="text-lg font-semibold tracking-tight"
            >
              Appearance
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize how PizzaHub looks and feels on this device.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Theme preference</h3>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode for a comfortable viewing
              experience.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border bg-muted/30 px-3 py-2">
            <ThemeModeToggle />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
