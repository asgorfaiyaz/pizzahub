import { Suspense } from "react";
import Link from "next/link";
import { SearchXIcon, UtensilsCrossedIcon } from "lucide-react";

import { getMenuItems, getLocations } from "@/lib/menu-items/queries";
import { BrowseMenuSearch } from "@/components/menu-items/browse-menu-search";
import { BrowseMenuFilters } from "@/components/menu-items/browse-menu-filters";
import { BrowseMenuPagination } from "@/components/menu-items/browse-menu-pagination";
import { MenuItemCard } from "@/components/menu-items/menu-item-card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 1;

type BrowseMenuSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function MenuItemCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-7 w-full" />
      </div>
    </div>
  );
}

function BrowseMenuSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Search + filters */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <Skeleton className="h-8 w-full" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-8 w-full sm:w-56" />
          <Skeleton className="h-8 w-full sm:w-56" />
        </div>
      </div>

      <Skeleton className="h-4 w-32" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <MenuItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function NoItemsState() {
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

function NoResultsState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card/50 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <SearchXIcon className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="font-medium">No items match your search</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different name, category, or location.
        </p>
      </div>
      <Link
        href="/browse-menu"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Clear filters
      </Link>
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────

async function BrowseMenuContent({
  searchParams,
}: {
  searchParams: Promise<BrowseMenuSearchParams>;
}) {
  const params = await searchParams;

  const search = (first(params.search) ?? "").trim();
  const category = first(params.category) ?? "";
  const location = first(params.location) ?? "";
  const requestedPage = Math.max(1, Number(first(params.page)) || 1);

  const [{ items, pagination }, locations] = await Promise.all([
    getMenuItems({
      search,
      category,
      location,
      page: requestedPage,
      limit: PAGE_SIZE,
    }),
    getLocations(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <BrowseMenuSearch />
        <BrowseMenuFilters locations={locations} />
      </div>

      {items.length === 0 ? (
        requestedPage > 1 ? (
          <NoResultsState />
        ) : (
          <NoItemsState />
        )
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {items.length} {items.length === 1 ? "item" : "items"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                href={`/menu/${item._id}`}
              />
            ))}
          </div>

          <BrowseMenuPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={{
              search: search || undefined,
              category: category || undefined,
              location: location || undefined,
            }}
          />
        </>
      )}
    </div>
  );
}

// ─── Page shell (renders instantly) ──────────────────────────────────────────

export default function BrowseMenuPage({
  searchParams,
}: {
  searchParams: Promise<BrowseMenuSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Browse Menu
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          Discover handmade pizzas, fresh sides, and drinks from our partner
          shops.
        </p>
      </header>
      <div className="mt-12 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Our selection</h2>
      </div>
      <Separator className="my-6 max-w-2xl" />
      <Suspense fallback={<BrowseMenuSkeleton />}>
        <BrowseMenuContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
