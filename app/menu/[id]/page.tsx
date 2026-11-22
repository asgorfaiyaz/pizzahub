import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  Home,
  MapPinIcon,
  Sparkles,
} from "lucide-react";

import { getMenuItemById } from "@/lib/menu-items/queries";
import { getServerSession } from "@/lib/server-session";
import { MenuDetailOrderCard } from "@/components/menu-items/menu-detail-order-card";
import { MenuDetailRelated } from "@/components/menu-items/menu-detail-related";
import { MenuDetailVendorCard } from "@/components/menu-items/menu-detail-vendor-card";
import { MenuItemGallery } from "@/components/menu-items/menu-item-gallery";
import { Reveal } from "@/components/home/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/lib/roles";
import type { MenuItemStatus } from "@/lib/menu-items/types";

function MenuItemDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-64" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <Skeleton className="aspect-4/3 w-full rounded-3xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>
      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}

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

  const shopName = vendor?.businessName ?? vendor?.name;
  const ownerName =
    vendor?.businessName && vendor?.name ? vendor.name : null;
  const location = vendor?.restaurantLocation || item.location;
  const phone = vendor?.restaurantPhone;
  const opening = vendor?.restaurantOpeningTime;
  const closing = vendor?.restaurantClosingTime;
  const hours = opening && closing ? `${opening} — ${closing}` : null;
  const isAvailable = item.status === "approved";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground" aria-label="Home">
          <Home className="size-4" aria-hidden />
        </Link>
        <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
        <Link
          href="/browse-menu"
          className="transition-colors hover:text-foreground"
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

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        {/* Gallery */}
        <Reveal>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-accent/30 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
              <MenuItemGallery images={item.images} alt={item.itemName} />
            </div>
            <Badge className="absolute top-4 left-4 gap-1.5 shadow-md">
              <Sparkles className="size-3.5" />
              Fresh pick
            </Badge>
          </div>
        </Reveal>

        {/* Details */}
        <div className="flex flex-col">
          <Reveal>
            <p className="text-sm font-medium text-primary">
              PizzaHub menu · {item.category}
            </p>
            <h1 className="mt-2 font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              {item.itemName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              {isAvailable ? (
                <Badge className="gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary-foreground" />
                  Available
                </Badge>
              ) : (
                <Badge variant="outline" className="capitalize">
                  {item.status}
                </Badge>
              )}
              {item.location ? (
                <Badge variant="outline" className="gap-1.5">
                  <MapPinIcon className="size-3.5" aria-hidden />
                  {item.location}
                </Badge>
              ) : null}
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tabular-nums tracking-tight">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">per item</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <Card className="mt-6 gap-2 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden />
                <h2
                  id="about-item"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  About this dish
                </h2>
              </div>
              <p className="leading-7 text-foreground">{item.description}</p>
            </Card>
          </Reveal>

          {shopName ? (
            <div className="mt-5">
              <MenuDetailVendorCard
                shopName={shopName}
                ownerName={ownerName}
                image={vendor?.image}
                location={location}
                phone={phone}
                hours={hours}
              />
            </div>
          ) : null}

          <div className="mt-5">
            <MenuDetailOrderCard
              itemId={item._id}
              itemName={item.itemName}
              price={item.price}
              canOrder={canOrder}
              reason={reason}
            />
          </div>

          <div className="mt-6">
            <Link
              href="/browse-menu"
              className={buttonVariants({ variant: "ghost" })}
            >
              <ArrowLeftIcon />
              Back to menu
            </Link>
          </div>
        </div>
      </div>

      <MenuDetailRelated category={item.category} currentId={item._id} />
    </main>
  );
}

export default function MenuItemPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<MenuItemDetailsSkeleton />}>
      <MenuItemDetails {...props} />
    </Suspense>
  );
}
