import { Suspense } from "react";
import { UtensilsCrossedIcon } from "lucide-react";

import { getMenuItems } from "@/lib/menu-items/queries";
import { MenuItemCard } from "@/components/menu-items/menu-item-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function MenuItemCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

function MenuItemsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <MenuItemCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────

async function MenuItemsList() {
  const items = await getMenuItems();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card/50 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UtensilsCrossedIcon className="size-5 text-muted-foreground" />
        </span>
        <div>
          <p className="font-medium">No menu items yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our kitchens are still preparing the menu. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuItemCard
          key={item._id}
          item={item}
          href={`/menu/${item._id}`}
        />
      ))}
    </div>
  );
}

// ─── Page shell (renders instantly) ──────────────────────────────────────────

export default async function BrowseMenuPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero header */}
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Browse Menu
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          Discover handmade pizzas, fresh sides, and drinks from our partner
          shops.
        </p>
      </header>

      {/* Section title + divider */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Our selection</h2>
      </div>
      <Separator className="my-6 max-w-2xl" />

      {/* Stream in the grid; show skeleton while fetching */}
      <Suspense fallback={<MenuItemsSkeleton />}>
        <MenuItemsList />
      </Suspense>
    </main>
  );
}
