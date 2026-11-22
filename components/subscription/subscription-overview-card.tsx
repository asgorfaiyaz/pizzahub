import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Layers3,
  Sparkles,
} from "lucide-react";

import type { VendorSubscriptionStatus } from "@/lib/subscriptions/types";
import { UpgradeButton } from "@/components/subscription/upgrade-button";
import { Reveal } from "@/components/home/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SubscriptionOverviewCard({
  status,
}: {
  status: VendorSubscriptionStatus;
}) {
  const { isPremium, plan, activeItemCount, maxFreeItems, canPublishMore } =
    status;

  const usagePercent =
    maxFreeItems > 0
      ? Math.min(100, Math.round((activeItemCount / maxFreeItems) * 100))
      : 0;

  const updatedAt = formatDate(
    (status as VendorSubscriptionStatus & { updatedAt?: string }).updatedAt,
  );

  return (
    <Reveal>
      <Card className="relative mt-8 gap-0 overflow-hidden py-0">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-44 bg-gradient-to-br from-primary/15 via-accent/40 to-transparent dark:from-primary/10 dark:via-accent/10"
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-16 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        {isPremium ? (
          <div
            aria-hidden="true"
            className="absolute -top-24 right-24 size-56 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-500/10"
          />
        ) : null}

        <div className="relative flex flex-wrap items-start justify-between gap-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span
              className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ${
                isPremium
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/25"
                  : "bg-primary text-primary-foreground shadow-primary/20"
              }`}
            >
              {isPremium ? (
                <Crown className="size-7" />
              ) : (
                <Sparkles className="size-7" />
              )}
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Current plan
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-3xl font-semibold capitalize tracking-tight">
                  {plan}
                </h2>
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? "Active" : "Free"}
                </Badge>
              </div>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {isPremium
                  ? "Your shop is featured across PizzaHub with every premium perk unlocked."
                  : "You're on the starter plan. Upgrade anytime for unlimited items and more."}
              </p>
              {updatedAt ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Last updated {updatedAt}
                </p>
              ) : null}
            </div>
          </div>

          {!isPremium ? <UpgradeButton /> : null}
        </div>

        <div className="relative grid gap-3 border-t bg-card/60 px-6 py-6 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <Layers3 className="size-4 text-muted-foreground" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Active items</p>
              <p className="text-lg font-semibold tabular-nums">
                {activeItemCount}
                {!isPremium ? (
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {maxFreeItems}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
              {canPublishMore ? (
                <CheckCircle2 className="size-4 text-success" />
              ) : (
                <AlertTriangle className="size-4 text-warning" />
              )}
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Publishing</p>
              <p className="text-sm font-semibold">
                {canPublishMore ? "Available" : "Limit reached"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
              {isPremium ? (
                <Crown className="size-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Sparkles className="size-4 text-muted-foreground" />
              )}
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Item limit</p>
              <p className="text-sm font-semibold">
                {isPremium ? "Unlimited" : `${maxFreeItems} items`}
              </p>
            </div>
          </div>
        </div>

        <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
          {!isPremium ? (
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>
                  You have used {activeItemCount} of {maxFreeItems} free items.
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {usagePercent}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          ) : (
            <Link
              href="/dashboard/vendor/menu-items"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Manage menu items
              <ArrowRight />
            </Link>
          )}

          {!isPremium && !canPublishMore ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-warning/50 bg-warning/10 p-4">
              <div>
                <p className="font-medium">
                  You&apos;ve reached your free plan limit
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to Premium to publish more menu items.
                </p>
              </div>
              <UpgradeButton size="sm" />
            </div>
          ) : null}
        </div>
      </Card>
    </Reveal>
  );
}
