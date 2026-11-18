import { ThemeModeToggle } from "@/components/theme-mode-toggle"

export default function ProfileSettingsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-border pb-6">
        <p className="text-sm font-medium text-primary">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Profile Settings</h1>
        <p className="mt-3 text-muted-foreground">
          Manage your preferences for a more personal PizzaHub experience.
        </p>
      </div>
      <section aria-labelledby="appearance-heading" className="py-8">
        <h2 id="appearance-heading" className="text-xl font-semibold">Appearance</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose whether PizzaHub follows a light or dark color mode.
        </p>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
          <div>
            <p className="font-medium">Color mode</p>
            <p className="mt-1 text-sm text-muted-foreground">Use dark mode in low-light environments.</p>
          </div>
          <ThemeModeToggle />
        </div>
      </section>
    </main>
  )
}
