import { Suspense } from "react";
import { unstable_rethrow } from "next/navigation";
import { Check } from "lucide-react";
import { getVendorSubscription } from "@/lib/subscriptions/queries";
import type { VendorSubscriptionStatus } from "@/lib/subscriptions/types";
import { UpgradeButton } from "@/components/subscription/upgrade-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const plans = [
  {
    id: "free",
    name: "Free",
    features: [
      "Max 3 active menu items",
      "Basic vendor dashboard",
      "Order management",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    features: [
      "Unlimited active items",
      "Premium vendor badge",
      "Featured menu placement",
      "All Free features",
    ],
  },
] as const;

function SubscriptionSkeleton() {
  return (
    <div className="mt-8 grid gap-4">
      <Card>
        <div className="flex items-center justify-between gap-4 px-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-32" />
          </div>
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>
        <div className="px-6">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="mt-3 h-2 w-full rounded-full" />
        </div>
      </Card>
      <Card className="gap-0 py-0">
        <div className="border-b px-6 py-3">
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="grid gap-4 px-6 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Skeleton className="h-5 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function SubscriptionError() {
  return (
    <Card className="mt-8 items-center gap-1 py-12 text-center">
      <p className="font-medium">Unable to load your subscription</p>
      <p className="text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </Card>
  );
}

function PlanTable({ status }: { status: VendorSubscriptionStatus }) {
  return (
    <Card className="mt-4 gap-0 overflow-hidden py-0">
      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 border-b bg-muted/50 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
        <span>Plan</span>
        <span>What you get</span>
      </div>

      <div className="divide-y">
        {plans.map((plan) => {
          const isCurrent = status.plan === plan.id;

          return (
            <div
              key={plan.id}
              className="grid gap-4 px-6 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:items-start"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{plan.name}</span>
                {isCurrent ? (
                  <Badge
                    variant={plan.id === "premium" ? "default" : "secondary"}
                  >
                    Current plan
                  </Badge>
                ) : plan.id === "premium" ? (
                  <Badge variant="outline">Recommended</Badge>
                ) : null}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:hidden">
                  What you get
                </p>
                <ul className="mt-2 space-y-2 sm:mt-0">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

async function SubscriptionContent() {
  let status: VendorSubscriptionStatus;

  try {
    status = await getVendorSubscription();
  } catch (error) {
    unstable_rethrow(error);
    return <SubscriptionError />;
  }

  const { isPremium, plan, activeItemCount, maxFreeItems, canPublishMore } =
    status;

  const usagePercent =
    maxFreeItems > 0
      ? Math.min(100, Math.round((activeItemCount / maxFreeItems) * 100))
      : 0;
  const showLimitBanner = !isPremium && !canPublishMore;

  return (
    <>
      <Card className="mt-8">
        <div className="flex flex-wrap items-start justify-between gap-4 px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current plan
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-semibold capitalize">{plan}</span>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {isPremium ? "Active" : "Free"}
              </Badge>
            </div>
          </div>

          {!isPremium ? <UpgradeButton /> : null}
        </div>

        <div className="px-6">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>
              {isPremium
                ? `${activeItemCount} active ${
                    activeItemCount === 1 ? "item" : "items"
                  }`
                : `You have used ${activeItemCount} of ${maxFreeItems} free items.`}
            </span>
            {!isPremium ? (
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {activeItemCount}/{maxFreeItems}
              </span>
            ) : null}
          </div>

          {!isPremium ? (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          ) : null}
        </div>

        {showLimitBanner ? (
          <div className="mx-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/40 p-4">
            <div>
              <p className="font-medium">
                You&apos;ve reached your free plan limit
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade to Premium to publish more menu items.
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <PlanTable status={status} />
    </>
  );
}

export default function VendorSubscriptionPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Subscription Page
      </h1>

      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionContent />
      </Suspense>
    </section>
  );
}
