import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SearchXIcon } from "lucide-react";

import { getMenuItemById } from "@/lib/menu-items/queries";
import { PlaceOrderButton } from "@/components/orders/place-order-button";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import type { MenuItem } from "@/lib/menu-items/types";

type CheckoutSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

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

function CheckoutSkeleton() {
  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-20 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </dl>

      <div className="mt-5 flex justify-end">
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

function MissingDetailsState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card/50 py-12 text-center">
      <SearchXIcon className="size-8 text-muted-foreground" />
      <p className="font-medium text-foreground">Order details not found</p>
      <p className="text-sm text-muted-foreground">
        Please go back and enter the delivery details again.
      </p>
      <Link
        href="/browse-menu"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Back to menu
      </Link>
    </div>
  );
}

async function CheckoutContent({
  searchParams,
}: {
  searchParams: Promise<CheckoutSearchParams>;
}) {
  const params = await searchParams;

  const itemId = first(params.itemId) ?? "";
  const deliveryDate = first(params.deliveryDate) ?? "";
  const deliveryAddress = first(params.deliveryAddress) ?? "";
  const message = first(params.message);

  if (!itemId || !deliveryDate || !deliveryAddress) {
    return <MissingDetailsState />;
  }

  let item: MenuItem;
  try {
    item = await getMenuItemById(itemId);
  } catch {
    notFound();
  }

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:p-6">
      {/* Header: item + price */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.itemName}
              width={64}
              height={64}
              className="rounded-xl object-cover"
            />
          ) : null}
          <div>
            <h2 className="font-semibold tracking-tight">{item.itemName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailRow label="Delivery date" value={formatDate(deliveryDate)} />
        <DetailRow label="Delivery address" value={deliveryAddress} />
        {message ? (
          <DetailRow label="Additional message" value={message} />
        ) : null}
      </dl>

      {/* Place order */}
      <div className="mt-5 flex justify-end">
        <PlaceOrderButton
          itemId={itemId}
          deliveryDate={deliveryDate}
          deliveryAddress={deliveryAddress}
          message={message}
        />
      </div>
    </div>
  );
}

export default function DemoCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<CheckoutSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Demo checkout
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Review the order details and place your order.
        </p>
      </header>

      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
