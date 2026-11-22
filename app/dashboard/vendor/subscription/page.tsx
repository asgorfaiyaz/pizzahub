import { Suspense } from "react";
import { unstable_rethrow } from "next/navigation";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getVendorSubscription } from "@/lib/subscriptions/queries";
import type { VendorSubscriptionStatus } from "@/lib/subscriptions/types";
import { PlanComparison } from "@/components/subscription/plan-comparison";
import { SubscriptionOverviewCard } from "@/components/subscription/subscription-overview-card";
import { SubscriptionSkeleton } from "@/components/subscription/subscription-skeleton";
import { Card } from "@/components/ui/card";

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

async function SubscriptionContent() {
  let status: VendorSubscriptionStatus;

  try {
    status = await getVendorSubscription();
  } catch (error) {
    unstable_rethrow(error);
    return <SubscriptionError />;
  }

  return (
    <>
      <SubscriptionOverviewCard status={status} />
      <PlanComparison status={status} />
    </>
  );
}

export default function VendorSubscriptionPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        {dashboardLinks.vendor[4].label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.vendor[4].description}
      </p>

      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionContent />
      </Suspense>
    </section>
  );
}
