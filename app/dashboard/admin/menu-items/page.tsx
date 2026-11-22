import { Suspense } from "react";
import Image from "next/image";
import { unstable_rethrow } from "next/navigation";
import { SearchXIcon, UtensilsCrossedIcon } from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getAdminMenuItems } from "@/lib/menu-items/queries";
import type { MenuItem, MenuItemStatus } from "@/lib/menu-items/types";
import { AdminMenuItemActions } from "@/components/admin/admin-menu-item-actions";
import { AdminMenuItemsFilters } from "@/components/admin/admin-menu-items-filters";
import { AdminMenuItemsPagination } from "@/components/admin/admin-menu-items-pagination";
import { AdminMenuItemsSearch } from "@/components/admin/admin-menu-items-search";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

type AdminMenuItemsSearchParams = Record<
  string,
  string | string[] | undefined
>;

const STATUS_CONFIG: Record<
  MenuItemStatus,
  { label: string; variant: "default" | "destructive" | "secondary" | "outline" }
> = {
  approved: { label: "Available", variant: "default" },
  inactive: { label: "Unavailable", variant: "secondary" },
  pending: { label: "Pending review", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MenuItemsSkeleton() {
  return (
    <Card className="mt-8 gap-0 overflow-hidden py-0">
      <div className="border-b bg-muted/50 px-4 py-3">
        <Skeleton className="h-3 w-28" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b p-4 last:border-0"
        >
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="size-7 rounded-lg" />
        </div>
      ))}
    </Card>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const Icon = hasFilters ? SearchXIcon : UtensilsCrossedIcon;

  return (
    <Card className="mt-8 items-center gap-3 border-dashed bg-card/50 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="font-medium">
          {hasFilters ? "No items match your filters" : "No menu items yet"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasFilters
            ? "Try a different search, status, or category."
            : "Submitted menu items will show up here."}
        </p>
      </div>
    </Card>
  );
}

function ErrorState() {
  return (
    <Card className="mt-8 items-center gap-2 py-12 text-center">
      <p className="font-medium">Unable to load menu items</p>
      <p className="text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </Card>
  );
}

function MenuItemRow({
  item,
  showSubmitted,
}: {
  item: MenuItem;
  showSubmitted: boolean;
}) {
  const { label, variant } = STATUS_CONFIG[item.status];
  const vendorName = item.vendor?.businessName ?? item.vendor?.name ?? "—";

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          {item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.itemName}
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-lg border object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
              <UtensilsCrossedIcon className="size-4 text-muted-foreground" />
            </span>
          )}
          <div className="min-w-0">
            <p className="max-w-56 truncate font-medium">{item.itemName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.category}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden min-w-40 md:table-cell">
        <p className="truncate text-sm">{vendorName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {item.vendor?.email ?? "—"}
        </p>
      </TableCell>
      <TableCell className="font-semibold tabular-nums">
        ${item.price.toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge variant={variant} className="shrink-0">
          {label}
        </Badge>
      </TableCell>
      {showSubmitted ? (
        <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
          {formatDate(item.createdAt)}
        </TableCell>
      ) : null}
      <TableCell className="text-right">
        <AdminMenuItemActions
          id={item._id}
          itemName={item.itemName}
          status={item.status}
        />
      </TableCell>
    </TableRow>
  );
}

async function AdminMenuItemsContent({
  searchParams,
}: {
  searchParams: Promise<AdminMenuItemsSearchParams>;
}) {
  const params = await searchParams;

  const search = (first(params.search) ?? "").trim();
  const status = first(params.status) ?? "all";
  const category = first(params.category) ?? "all";
  const requestedPage = Math.max(1, Number(first(params.page)) || 1);

  let items: MenuItem[];
  let pagination;

  try {
    const result = await getAdminMenuItems({
      search,
      status,
      category,
      page: requestedPage,
      limit: PAGE_SIZE,
    });
    items = result.items;
    pagination = result.pagination;
  } catch (error) {
    unstable_rethrow(error);
    return <ErrorState />;
  }

  const hasFilters = Boolean(search || status !== "all" || category !== "all");
  const showSubmitted = items.some((item) => item.createdAt);

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <AdminMenuItemsSearch />
        <AdminMenuItemsFilters />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {items.length} of {pagination.total}{" "}
          {pagination.total === 1 ? "item" : "items"}
        </p>
        <p className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <Card className="gap-0 overflow-hidden py-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Item</TableHead>
                  <TableHead className="hidden md:table-cell">Vendor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  {showSubmitted ? (
                    <TableHead className="hidden lg:table-cell">
                      Submitted
                    </TableHead>
                  ) : null}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <MenuItemRow
                    key={item._id}
                    item={item}
                    showSubmitted={showSubmitted}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>

          <AdminMenuItemsPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={{
              search: search || undefined,
              status: status === "all" ? undefined : status,
              category: category === "all" ? undefined : category,
            }}
          />
        </>
      )}
    </div>
  );
}

export default function AdminMenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<AdminMenuItemsSearchParams>;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {dashboardLinks.admin[2].label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.admin[2].description}
      </p>

      <Suspense fallback={<MenuItemsSkeleton />}>
        <AdminMenuItemsContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
