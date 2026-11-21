import { Suspense } from "react";

import { getMyOrders } from "@/lib/orders/queries";
import { MyOrders } from "@/components/orders/my-orders";
import { Skeleton } from "@/components/ui/skeleton";

function MyOrdersSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <article
          key={i}
          className="overflow-hidden rounded-2xl border bg-card shadow-sm"
        >
          {/* Header skeleton */}
          <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3 sm:px-5">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Item skeleton */}
          <div className="flex items-start gap-3 p-4 sm:p-5">
            <Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" />

            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-5 w-3/4 max-w-52" />
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3 w-44 max-w-full" />
            </div>
          </div>

          {/* Delivery details skeleton */}
          <div className="mx-4 rounded-xl bg-muted/30 p-4 sm:mx-5">
            <Skeleton className="mb-4 h-4 w-28" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full max-w-xs" />
              </div>
            </div>
          </div>

          {/* Action skeleton */}
          <div className="mt-4 flex justify-end border-t px-4 py-4 sm:px-5">
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </article>
      ))}
    </div>
  );
}

async function MyOrdersList() {
  const orders = await getMyOrders();

  return <MyOrders orders={orders} />;
}

export default function CustomerOrdersPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      {/* Page header */}
      <header className="mb-8 border-b pb-6">
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          My Orders
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Keep track of your orders, check delivery details, and stay updated on
          their status from one place.
        </p>
      </header>

      {/* Orders list */}
      <section aria-label="Your orders">
        <Suspense fallback={<MyOrdersSkeleton />}>
          <MyOrdersList />
        </Suspense>
      </section>
    </main>
  );
}
