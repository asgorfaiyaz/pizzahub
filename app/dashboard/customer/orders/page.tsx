import { Suspense } from "react";
import { unstable_rethrow } from "next/navigation";

import { getCustomerOverview, getMyOrders } from "@/lib/orders/queries";
import type { CustomerOverview, Order } from "@/lib/orders/types";
import { CustomerOrderCard } from "@/components/orders/customer-order-card";
import { CustomerOrdersEmpty } from "@/components/orders/customer-orders-empty";
import { CustomerOrdersStats } from "@/components/orders/customer-orders-stats";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MyOrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="gap-3 p-5">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-4">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-4 p-5">
            <Skeleton className="size-24 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="mx-5 mb-5 h-24 rounded-xl bg-muted/30" />
        </Card>
      ))}
    </div>
  );
}

function OrdersError() {
  return (
    <Card className="py-12 text-center">
      <p className="font-medium">Unable to load your orders</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </Card>
  );
}

async function MyOrdersList() {
  let orders: Order[];
  let overview: CustomerOverview;

  try {
    [orders, overview] = await Promise.all([
      getMyOrders(),
      getCustomerOverview(),
    ]);
  } catch (error) {
    unstable_rethrow(error);
    return <OrdersError />;
  }

  return (
    <div className="space-y-6">
      <CustomerOrdersStats overview={overview} />

      {orders.length === 0 ? (
        <CustomerOrdersEmpty />
      ) : (
        <section aria-label="Your orders" className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Order history
            </h2>
            <p className="text-sm text-muted-foreground">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
          </div>

          {orders.map((order, index) => (
            <CustomerOrderCard key={order._id} order={order} index={index} />
          ))}
        </section>
      )}
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          My Orders
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Keep track of your orders, check delivery details, and stay updated on
          their status from one place.
        </p>
      </header>

      <Suspense fallback={<MyOrdersSkeleton />}>
        <MyOrdersList />
      </Suspense>
    </main>
  );
}
