import { Suspense } from "react";
import Link from "next/link";
import { PlusIcon, UtensilsCrossedIcon } from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getVendorMenuItems } from "@/lib/menu-items/queries";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorMenuItemActions } from "@/components/menu-items/vendor-menu-item-actions";
import type { MenuItemStatus } from "@/lib/menu-items/types";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  MenuItemStatus,
  {
    label: string;
    variant: "default" | "destructive" | "secondary" | "outline";
  }
> = {
  approved: { label: "Available", variant: "default" },
  inactive: { label: "Unavailable", variant: "secondary" },
  pending: { label: "Pending review", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
};

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function MenuItemsGridSkeleton() {
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl border bg-card p-4 gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="mt-auto flex items-center justify-between border-t pt-3">
            <Skeleton className="h-4 w-12" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────

async function MenuItemsList() {
  const items = await getVendorMenuItems();

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card/50 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UtensilsCrossedIcon className="size-5 text-muted-foreground" />
        </span>
        <div>
          <p className="font-medium">No menu items yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding your first pizza or side dish.
          </p>
        </div>
        <Link
          href="/dashboard/vendor/add-menu-item"
          className={buttonVariants({ size: "sm" })}
        >
          <PlusIcon />
          Add your first item
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      <ul className="mt-3 grid gap-3">
        {items.map((item) => {
          const { label, variant } = STATUS_CONFIG[item.status];
          return (
            <li
              key={item._id}
              className="flex flex-col gap-3 rounded-xl border bg-card p-4"
            >
              {/* Name + status badge */}
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium leading-snug">{item.itemName}</h2>
                <Badge variant={variant} className="mt-0.5 shrink-0">
                  {label}
                </Badge>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                <span>{item.category}</span>
                <span>{item.location}</span>
              </div>

              {/* Price + actions */}
              <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                <span className="text-sm font-semibold tabular-nums">
                  ${item.price.toFixed(2)}
                </span>
                <VendorMenuItemActions item={item} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// ─── Page shell (renders instantly) ──────────────────────────────────────────

export default function VendorMenuItemsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* Header — static, no data needed */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {dashboardLinks.vendor[1].label}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {dashboardLinks.vendor[1].description}
          </p>
        </div>
      </div>

      {/* Stream in the list; show skeleton while fetching */}
      <Suspense fallback={<MenuItemsGridSkeleton />}>
        <MenuItemsList />
      </Suspense>
    </section>
  );
}
