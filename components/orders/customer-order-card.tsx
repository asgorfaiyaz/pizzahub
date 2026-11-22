import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquareText,
  PackageIcon,
  Store,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { Reveal } from "@/components/home/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Order, OrderStatus } from "@/lib/orders/types";

const STATUS: Record<
  OrderStatus,
  { label: string; variant: "outline" | "secondary" | "destructive" | "ghost"; icon: LucideIcon }
> = {
  pending: { label: "Pending", variant: "outline", icon: Clock3 },
  accepted: { label: "Accepted", variant: "secondary", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
  cancelled: { label: "Cancelled", variant: "ghost", icon: XCircle },
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

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function CustomerOrderCard({
  order,
  index,
}: {
  order: Order;
  index: number;
}) {
  const status = STATUS[order.status];
  const StatusIcon = status.icon;

  return (
    <Reveal delay={index * 0.06}>
      <Card className="gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-background text-muted-foreground">
              <PackageIcon className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Order placed</p>
              <p className="text-sm font-semibold">
                {formatDate(order.requestDate)}
              </p>
            </div>
          </div>

          <Badge variant={status.variant} className="gap-1.5">
            <StatusIcon className="size-3.5" />
            {status.label}
          </Badge>
        </div>

        {/* Item */}
        <div className="flex items-start gap-4 p-5">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border bg-muted">
            {order.item.images[0] ? (
              <Image
                src={order.item.images[0]}
                alt={order.item.itemName}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-muted-foreground">
                <PackageIcon className="size-7" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="line-clamp-2 font-heading text-lg font-semibold tracking-tight">
                {order.item.itemName}
              </h2>
              <span className="text-lg font-semibold tabular-nums">
                ${order.item.price.toFixed(2)}
              </span>
            </div>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Store className="size-3.5 shrink-0" aria-hidden />
              {order.vendor.businessName || order.vendor.name}
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              Delivery {formatDate(order.deliveryDate)}
            </p>
          </div>
        </div>

        {/* Delivery details */}
        <div className="mx-5 mb-5 rounded-xl border bg-muted/25 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailLine
              icon={CalendarDays}
              label="Delivery date"
              value={formatDate(order.deliveryDate)}
            />
            <DetailLine
              icon={MapPin}
              label="Delivery address"
              value={order.deliveryAddress}
            />
          </div>

          {order.message ? (
            <div className="mt-4 flex items-start gap-2.5 border-t pt-4">
              <MessageSquareText
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <p className="text-xs text-muted-foreground">
                  Note to the restaurant
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {order.message}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">
          <Link
            href={`/menu/${order.item._id}`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View item
            <ArrowUpRight />
          </Link>

          {order.status === "pending" ? (
            <CancelOrderButton orderId={order._id} />
          ) : (
            <span className="text-xs text-muted-foreground">
              {order.status === "accepted"
                ? "The kitchen is preparing your order."
                : "No further action needed."}
            </span>
          )}
        </div>
      </Card>
    </Reveal>
  );
}
