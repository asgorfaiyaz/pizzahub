import { Suspense } from "react";

import { getCustomerOverview } from "@/lib/orders/queries";
import { CustomerOverviewStats } from "@/components/orders/customer-overview-stats";
import { Skeleton } from "@/components/ui/skeleton";

function OverviewStatsSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-10 w-20" />
        </div>
      ))}
    </div>
  );
}

async function CustomerOverviewContent() {
  const overview = await getCustomerOverview();

  return <CustomerOverviewStats overview={overview} />;
}

export default function CustomerOverviewPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b pb-6">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Customer Overview
        </h1>
        <p className="mt-3 text-muted-foreground">
          Track your orders and their status in one place.
        </p>
      </header>

      <Suspense fallback={<OverviewStatsSkeleton />}>
        <CustomerOverviewContent />
      </Suspense>
    </main>
  );
}
