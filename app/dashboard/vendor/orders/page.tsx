import { Suspense } from "react";

import { getVendorOrders } from "@/lib/orders/queries";
import { VendorOrders } from "@/components/orders/vendor-orders";
import { Skeleton } from "@/components/ui/skeleton";

function VendorOrdersSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function VendorOrdersList() {
  const orders = await getVendorOrders();

  return <VendorOrders orders={orders} />;
}

export default function VendorOrdersPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b pb-6">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Customer Orders
        </h1>
        <p className="mt-3 text-muted-foreground">
          Review orders placed with your shop and update their status.
        </p>
      </header>

      <Suspense fallback={<VendorOrdersSkeleton />}>
        <VendorOrdersList />
      </Suspense>
    </main>
  );
}
