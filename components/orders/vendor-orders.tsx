import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { VendorOrderStatusActions } from "@/components/orders/vendor-order-status-actions";
import type { OrderStatus, VendorOrder } from "@/lib/orders/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const STATUS_BADGES: Record<OrderStatus, "outline" | "secondary" | "destructive" | "ghost"> = {
  pending: "outline",
  accepted: "secondary",
  rejected: "destructive",
  cancelled: "ghost",
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function VendorOrderCard({ order }: { order: VendorOrder }) {
  return (
    <article className="rounded-xl border bg-card p-4 sm:p-6">
      {/* Header: item + customer + status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {order.item.images[0] ? (
            <Image
              src={order.item.images[0]}
              alt={order.item.itemName}
              width={64}
              height={64}
              className="rounded-xl object-cover"
            />
          ) : null}
          <div>
            <h2 className="font-semibold tracking-tight">
              {order.item.itemName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customer.name} — {order.customer.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Badge variant={STATUS_BADGES[order.status]}>
            {STATUS_LABELS[order.status]}
          </Badge>
          <VendorOrderStatusActions
            orderId={order._id}
            status={order.status}
          />
        </div>
      </div>

      {/* Details */}
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailRow
          label="Delivery date"
          value={formatDate(order.deliveryDate)}
        />
        <DetailRow label="Delivery address" value={order.deliveryAddress} />
        <DetailRow label="Order status" value={STATUS_LABELS[order.status]} />
        <DetailRow
          label="Item price"
          value={`$${order.item.price.toFixed(2)}`}
        />
        <DetailRow label="Item category" value={order.item.category} />
        {order.customerMessage ? (
          <DetailRow
            label="Customer message"
            value={order.customerMessage}
          />
        ) : null}
      </dl>
    </article>
  );
}

export function VendorOrders({ orders }: { orders: VendorOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card/50 py-12 text-center">
        <p className="font-medium text-foreground">No orders yet</p>
        <p className="text-sm text-muted-foreground">
          Customers will place orders with your shop here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <VendorOrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
