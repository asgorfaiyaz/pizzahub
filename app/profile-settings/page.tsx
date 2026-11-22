import { Suspense } from "react";
import {
  BanIcon,
  BriefcaseIcon,
  CreditCardIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { requireActiveSession } from "@/lib/server-session";
import { ROLE_LABELS } from "@/lib/roles";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function ProfileInfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border/70 px-4 py-3 first:border-t-0 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

async function ProfileSettingsContent() {
  const session = await requireActiveSession();
  const user = session.user;

  const role = user.role ?? "customer";
  const isVendor = role === "vendor";
  const initials = user.name.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Hero: avatar + name + role */}
      <section
        aria-labelledby="profile-heading"
        className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:p-6"
      >
        <Avatar size="lg" className="size-16 rounded-2xl sm:rounded-3xl">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/8 to-transparent text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2
            id="profile-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            {user.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
            {isVendor && user.businessName ? (
              <Badge variant="outline">{user.businessName}</Badge>
            ) : null}
          </div>
        </div>
      </section>

      {/* Account details (read-only) */}
      <section
        aria-labelledby="account-details-heading"
        className="rounded-xl border bg-card"
      >
        <div className="border-b px-4 py-3 sm:px-6">
          <h2
            id="account-details-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Account details
          </h2>
        </div>
        <ProfileInfoRow
          label="Email"
          icon={<MailIcon className="size-4" />}
          value={user.email}
        />
        <ProfileInfoRow
          label="Role"
          icon={<UserIcon className="size-4" />}
          value={ROLE_LABELS[role]}
        />
        <ProfileInfoRow
          label="Blocked"
          icon={<BanIcon className="size-4" />}
          value={user.isBlocked ? "Yes" : "No"}
        />
        <ProfileInfoRow
          label="Subscription plan"
          icon={<CreditCardIcon className="size-4" />}
          value={user.subscriptionPlan ?? "Not set"}
        />
        {isVendor && user.businessName ? (
          <ProfileInfoRow
            label="Business"
            icon={<BriefcaseIcon className="size-4" />}
            value={user.businessName}
          />
        ) : null}
      </section>

      {/* Editable profile: name + profile image */}

      <ProfileSettingsForm initialName={user.name} image={user.image ?? null} />

      {/* Appearance */}
      <section
        aria-labelledby="appearance-heading"
        className="overflow-hidden rounded-2xl border bg-card shadow-sm"
      >
        <div className="border-b px-5 py-5 sm:px-6">
          <h2
            id="appearance-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Appearance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize how the application looks and feels to you.
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Theme preference</h3>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode for a more comfortable viewing
              experience.
            </p>
          </div>

          <div className="shrink-0 rounded-lg border bg-muted/30 px-3 py-2">
            <ThemeModeToggle />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your preferences for a more personal PizzaHub experience.
        </p>
      </div>

      <Suspense fallback={null}>
        <ProfileSettingsContent />
      </Suspense>
    </main>
  );
}
