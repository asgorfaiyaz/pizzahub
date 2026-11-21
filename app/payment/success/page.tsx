import { Suspense } from "react";
import Link from "next/link";
import { Check, Clock3 } from "lucide-react";

import { getVendorSubscription } from "@/lib/subscriptions/queries";
import type { VendorSubscriptionStatus } from "@/lib/subscriptions/types";
import { RefreshStatusButton } from "@/components/subscription/refresh-status-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const premiumFeatures = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
];

function SuccessSkeleton() {
  return (
    <Card className="items-center gap-4 py-12">
      <Skeleton className="size-14 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <Skeleton className="h-8 w-40 rounded-lg" />
    </Card>
  );
}

function ErrorState() {
  return (
    <Card className="items-center gap-3 py-12 text-center">
      <p className="font-medium">Unable to confirm your subscription</p>
      <p className="max-w-md text-sm text-muted-foreground">
        If your payment went through, your plan will update shortly. You can
        check the status from your subscription page.
      </p>
      <Link
        href="/dashboard/vendor/subscription"
        className={buttonVariants({ size: "sm" })}
      >
        Go to subscription
      </Link>
    </Card>
  );
}

function PendingState() {
  return (
    <Card className="items-center gap-3 py-12 text-center" role="status">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Clock3 className="size-7 text-muted-foreground" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">
        Payment received
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We&apos;re confirming your subscription with Stripe. This usually takes
        a few seconds, so refresh the status in a moment.
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <RefreshStatusButton />
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View subscription
        </Link>
      </div>
    </Card>
  );
}

function PremiumState({ status }: { status: VendorSubscriptionStatus }) {
  return (
    <Card className="items-center gap-4 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Check className="size-7 text-primary" />
      </span>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Payment successful
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re now a Premium vendor. Your subscription is active.
        </p>
      </div>

      <Badge>Premium</Badge>

      <ul className="mt-1 grid gap-2 text-left text-sm">
        {premiumFeatures.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        {status.activeItemCount} active{" "}
        {status.activeItemCount === 1 ? "item" : "items"} on your menu
      </p>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/dashboard/vendor/menu-items"
          className={buttonVariants({ size: "sm" })}
        >
          Go to my menu items
        </Link>
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View subscription
        </Link>
      </div>
    </Card>
  );
}

async function SuccessContent() {
  let status: VendorSubscriptionStatus;

  try {
    status = await getVendorSubscription();
  } catch {
    return <ErrorState />;
  }

  if (!status.isPremium) {
    return <PendingState />;
  }

  return <PremiumState status={status} />;
}

export default function SuccessPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
