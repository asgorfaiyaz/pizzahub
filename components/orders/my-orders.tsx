import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderStatus } from "@/lib/orders/types";
import { PackageIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

const STATUS_BADGES: Record<
  OrderStatus,
  { label: string; variant: "outline" | "secondary" | "destructive" | "ghost" }
> = {
  pending: { label: "Pending", variant: "outline" },
  accepted: { label: "Accepted", variant: "secondary" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "ghost" },
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium leading-relaxed text-foreground">
        {value}
      </dd>
    </div>
  );
}

export function MyOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
          <PackageIcon className="size-6 text-muted-foreground" />
        </div>

        <h2 className="text-base font-semibold tracking-tight">
          No orders yet
        </h2>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Your order history will appear here. Explore the menu and find
          something delicious to enjoy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <article
          key={order._id}
          className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Order header */}
          <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3 sm:px-5">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Order placed
              </p>
              <p className="text-sm font-medium">
                {formatDate(order.requestDate)}
              </p>
            </div>

            <Badge variant={STATUS_BADGES[order.status].variant}>
              {STATUS_BADGES[order.status].label}
            </Badge>
          </div>

          {/* Item information */}
          <div className="flex items-start gap-3 p-4 sm:p-5">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
              {order.item.images[0] ? (
                <Image
                  src={order.item.images[0]}
                  alt={order.item.itemName}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <PackageIcon className="size-7" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="line-clamp-2 font-semibold leading-snug tracking-tight">
                {order.item.itemName}
              </h2>

              <p className="text-sm text-muted-foreground">
                Prepared by{" "}
                <span className="font-medium text-foreground">
                  {order.vendor.businessName || order.vendor.name}
                </span>
              </p>

              <p className="text-xs text-muted-foreground">
                Delivery scheduled for {formatDate(order.deliveryDate)}
              </p>
            </div>
          </div>

          {/* Order details */}
          <div className="mx-4 rounded-xl bg-muted/30 p-4 sm:mx-5">
            <h3 className="mb-4 text-sm font-semibold">Delivery details</h3>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow
                label="Delivery date"
                value={formatDate(order.deliveryDate)}
              />

              <DetailRow
                label="Order status"
                value={STATUS_BADGES[order.status].label}
              />

              <div className="sm:col-span-2">
                <DetailRow
                  label="Delivery address"
                  value={order.deliveryAddress}
                />
              </div>
            </dl>
          </div>

          {/* Additional message */}
          {order.message && (
            <div className="mx-4 mt-4 space-y-1 sm:mx-5">
              <p className="text-xs font-medium text-muted-foreground">
                Your message to the restaurant
              </p>
              <p className="rounded-lg border bg-background px-3 py-2.5 text-sm leading-relaxed">
                {order.message}
              </p>
            </div>
          )}

          {/* Actions */}
          {order.status === "pending" && (
            <div className="mt-4 flex justify-end border-t px-4 py-4 sm:px-5">
              <CancelOrderButton orderId={order._id} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
