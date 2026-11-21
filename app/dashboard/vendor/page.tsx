import { Suspense } from "react";
import {
  CircleCheck,
  ClipboardCheck,
  ClipboardList,
  Crown,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getVendorOverview } from "@/lib/vendor/queries";
import type { VendorOverview } from "@/lib/vendor/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PageHeader({ showPremium }: { showPremium: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {dashboardLinks.vendor[0].label}
        </h1>
        {showPremium ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
            <Crown className="size-3.5" />
            Premium vendor
          </span>
        ) : null}
      </div>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.vendor[0].description}
      </p>
    </>
  );
}

function PremiumBanner() {
  return (
    <div
      className="relative mt-8 overflow-hidden rounded-2xl border border-amber-300/70 p-6 shadow-sm dark:border-amber-400/25"
      style={{
        backgroundImage:
          "linear-gradient(110deg, rgba(251,191,36,0.18), rgba(249,115,22,0.10) 45%, rgba(239,68,68,0.06))",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/10"
      />

      <div className="relative flex flex-wrap items-center gap-5">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-amber-500/30"
          style={{
            backgroundImage: "linear-gradient(135deg, #f59e0b, #ea580c)",
          }}
        >
          <Crown className="size-6" />
        </span>

        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            Premium plan
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Your shop stands out.
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Unlimited items, a Premium badge, and featured menu placement are
            active on your storefront.
          </p>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <>
      <div className="flex items-center gap-3">
        <Skeleton className="mt-2 h-9 w-36" />
      </div>
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="gap-3 p-5">
            <Skeleton className="size-5 w-5 rounded-md" />
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-3 w-28" />
          </Card>
        ))}
      </div>
    </>
  );
}

function ErrorState() {
  return (
    <>
      <PageHeader showPremium={false} />
      <Card className="mt-8 items-center gap-2 py-12 text-center">
        <p className="font-medium">Unable to load your overview</p>
        <p className="text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </Card>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  premium,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  premium: boolean;
}) {
  return (
    <Card
      className={`gap-3 p-5 ${
        premium
          ? "border-amber-300/70 bg-amber-50/40 dark:border-amber-400/20 dark:bg-amber-400/5"
          : ""
      }`}
    >
      {premium ? (
        <span className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
          <Icon className="size-5" />
        </span>
      ) : (
        <Icon className="size-5 text-muted-foreground" />
      )}
      <p className="text-3xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}

function OverviewContent({ data }: { data: VendorOverview }) {
  const isPremium = data.currentSubscriptionPlan === "premium";

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    {
      label: "Total menu items",
      value: data.totalMenuItems,
      icon: UtensilsCrossed,
    },
    {
      label: "Active menu items",
      value: data.activeMenuItems,
      icon: CircleCheck,
    },
    {
      label: "Pending orders",
      value: data.pendingOrders,
      icon: ClipboardList,
    },
    {
      label: "Accepted orders",
      value: data.acceptedOrders,
      icon: ClipboardCheck,
    },
  ];

  return (
    <>
      <PageHeader showPremium={isPremium} />
      {isPremium ? <PremiumBanner /> : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} premium={isPremium} />
        ))}
      </div>
    </>
  );
}

async function OverviewContentLoader() {
  let data: VendorOverview;

  try {
    data = await getVendorOverview();
  } catch {
    return <ErrorState />;
  }

  return <OverviewContent data={data} />;
}

export default function VendorOverviewPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContentLoader />
      </Suspense>
    </section>
  );
}
