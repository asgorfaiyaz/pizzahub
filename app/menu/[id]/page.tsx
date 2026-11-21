import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  StoreIcon,
} from "lucide-react";

import { getMenuItemById } from "@/lib/menu-items/queries";
import { getServerSession } from "@/lib/server-session";
import { MenuItemGallery } from "@/components/menu-items/menu-item-gallery";
import { OrderControl } from "@/components/orders/order-control";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/lib/roles";
import type { MenuItemStatus } from "@/lib/menu-items/types";

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function MenuItemDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-4/3 w-full" />
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="mt-4 h-5 w-20 rounded-full" />
          <Skeleton className="mt-4 h-4 w-1/3" />
          <Skeleton className="mt-6 h-16 w-full rounded-xl" />
          <Skeleton className="mt-6 flex-1" />
        </div>
      </div>
    </main>
  );
}

// ─── Order availability ───────────────────────────────────────────────────────

function getOrderState(
  role: UserRole | null | undefined,
  status: MenuItemStatus,
) {
  if (role === "customer") {
    if (status !== "approved") {
      return {
        canOrder: false,
        reason: "This item isn't available for ordering right now.",
      };
    }

    return { canOrder: true, reason: null };
  }

  if (!role) {
    return {
      canOrder: false,
      reason: "Sign in to place an order for this item.",
    };
  }

  return {
    canOrder: false,
    reason: "Only customers can place orders.",
  };
}

// ─── Async data component ─────────────────────────────────────────────────────

async function MenuItemDetails(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let item;
  try {
    item = await getMenuItemById(id);
  } catch {
    notFound();
  }

  const session = await getServerSession();
  const role = session?.user.role;

  const { canOrder, reason } = getOrderState(role, item.status);

  const vendor = item.vendor;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/browse-menu"
          className="hover:text-foreground transition-colors"
        >
          Browse Menu
        </Link>
        <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{item.category}</span>
        <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
        <span className="max-w-60 truncate font-medium text-foreground">
          {item.itemName}
        </span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <MenuItemGallery images={item.images} alt={item.itemName} />

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {item.itemName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{item.category}</Badge>
            <span className="text-2xl font-semibold tabular-nums">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {item.location ? (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" aria-hidden />
              {item.location}
            </p>
          ) : null}

          {/* Vendor */}
          {vendor ? (
            <div className="mt-5 flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
                <StoreIcon
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {vendor.businessName ?? vendor.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {vendor.businessName ? `By ${vendor.name}` : "Vendor"}
                </p>
              </div>
            </div>
          ) : null}

          <Separator className="my-6" />

          <section aria-labelledby="about-item">
            <h2
              id="about-item"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              About this dish
            </h2>
            <p className="mt-3 leading-7 text-foreground">{item.description}</p>
          </section>

          {/* Order option */}
          <section aria-labelledby="order-item" className="mt-8">
            <h2
              id="order-item"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Order
            </h2>

            {canOrder ? (
              <div className="mt-3">
                <OrderControl
                  itemId={item._id}
                  itemName={item.itemName}
                  price={item.price}
                />
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                {reason}
              </p>
            )}
          </section>

          <div className="mt-auto pt-8">
            <Link
              href="/browse-menu"
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeftIcon />
              Back to menu
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Page shell (renders instantly) ──────────────────────────────────────────

export default function MenuItemPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<MenuItemDetailsSkeleton />}>
      <MenuItemDetails {...props} />
    </Suspense>
  );
}
