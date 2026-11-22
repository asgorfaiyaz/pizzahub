import Link from "next/link";
import {
  Briefcase,
  CalendarDays,
  Crown,
  Mail,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import { ROLE_LABELS } from "@/lib/roles";
import type { ProfileUser } from "@/components/profile/types";
import { Reveal } from "@/components/home/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase() || "U";
}

export function ProfileHero({ user }: { user: ProfileUser }) {
  const role = user.role || "customer";
  const isVendor = role === "vendor";
  const isPremium = user.subscriptionPlan === "premium";
  const joinedAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Reveal>
      <section
        aria-labelledby="profile-heading"
        className="relative overflow-hidden rounded-3xl border bg-card"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-primary/12 via-accent/40 to-transparent dark:from-primary/10 dark:via-accent/10"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-16 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 left-1/3 size-56 rounded-full bg-orange-300/20 blur-3xl dark:bg-amber-500/5"
        />

        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-5">
            <Avatar className="size-20 rounded-3xl ring-4 ring-background shadow-lg sm:size-24">
              {user.image ? (
                <AvatarImage src={user.image} alt={`${user.name} profile`} />
              ) : null}
              <AvatarFallback className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/8 to-transparent text-xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2
                id="profile-heading"
                className="mt-2 font-heading text-3xl font-semibold tracking-tight"
              >
                {user.name}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  {ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role}
                </Badge>
                {isVendor && user.businessName ? (
                  <Badge variant="outline" className="gap-1.5">
                    <Briefcase className="size-3.5" />
                    {user.businessName}
                  </Badge>
                ) : null}
                {isPremium ? (
                  <Badge className="gap-1.5">
                    <Crown className="size-3.5" />
                    Premium
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <Link href="#edit-profile" className={buttonVariants()}>
              <Pencil />
              Edit profile
            </Link>
            {joinedAt ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Member since {joinedAt}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
