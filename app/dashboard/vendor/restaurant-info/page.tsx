import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Pencil,
  Phone,
  Store,
  Sunrise,
  Sunset,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { requireActiveSession } from "@/lib/server-session";
import type { RestaurantInfoValues } from "@/lib/vendor/validation";
import { Reveal } from "@/components/home/reveal";
import { RestaurantInfoForm } from "@/components/vendor/restaurant-info-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function RestaurantInfoSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

async function RestaurantInfoContent() {
  const session = await requireActiveSession();
  const user = session.user;

  const location = user.restaurantLocation?.trim();
  const openingTime = user.restaurantOpeningTime?.trim();
  const closingTime = user.restaurantClosingTime?.trim();
  const phone = user.restaurantPhone?.trim();
  const businessName = user.businessName?.trim() || user.name;

  const initialValues: RestaurantInfoValues = {
    businessName: user.businessName?.trim() ?? "",
    restaurantLocation: location ?? "",
    restaurantOpeningTime: openingTime ?? "",
    restaurantClosingTime: closingTime ?? "",
    restaurantPhone: phone ?? "",
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border bg-card">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/40 to-transparent dark:from-primary/10 dark:via-accent/10"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-16 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <UtensilsCrossed className="size-7" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Your restaurant
                </p>
                <h2 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
                  {businessName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Managed by {user.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Store className="size-3.5" />
                Vendor shop
              </Badge>
              <Link href="#edit-restaurant" className={buttonVariants({ size: "sm" })}>
                <Pencil />
                Edit details
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2">
        <Reveal delay={0.05}>
          <InfoCard
            icon={MapPin}
            label="Location"
            value={location ?? "Not provided"}
            description="Where customers can find your shop"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <InfoCard
            icon={Phone}
            label="Phone"
            value={phone ?? "Not provided"}
            description="Contact number for your restaurant"
          />
        </Reveal>
        <Reveal delay={0.15}>
          <InfoCard
            icon={Sunrise}
            label="Opening time"
            value={openingTime ?? "Not provided"}
            description="Doors open for orders"
          />
        </Reveal>
        <Reveal delay={0.2}>
          <InfoCard
            icon={Sunset}
            label="Closing time"
            value={closingTime ?? "Not provided"}
            description="Last orders are taken before this time"
          />
        </Reveal>
      </div>

      <Reveal>
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Clock3 className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="font-semibold">Today&apos;s hours</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {openingTime && closingTime
                  ? `${openingTime} — ${closingTime}`
                  : "Opening hours are not complete yet."}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/vendor/menu-items"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View menu items
            <ArrowRight />
          </Link>
        </Card>
      </Reveal>

      <Reveal>
        <section
          id="edit-restaurant"
          aria-labelledby="edit-restaurant-heading"
          className="overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">Keep it current</p>
            <h2
              id="edit-restaurant-heading"
              className="mt-1 text-2xl font-semibold tracking-tight"
            >
              Edit restaurant info
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your location, contact number, and opening hours. Changes
              appear immediately on this page.
            </p>
          </div>
          <RestaurantInfoForm initialValues={initialValues} />
        </section>
      </Reveal>
    </div>
  );
}

export default function VendorRestaurantInfoPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <p className="mt-2 text-sm font-medium text-primary">
        {dashboardLinks.vendor[6].label}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Restaurant info
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.vendor[6].description}
      </p>

      <Suspense fallback={<RestaurantInfoSkeleton />}>
        <RestaurantInfoContent />
      </Suspense>
    </section>
  );
}
