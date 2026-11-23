import { Suspense } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import {
  Clock3,
  CreditCard,
  Pizza,
  Store,
  UsersRound,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getAdminOverview } from "@/lib/admin/queries";
import type { AdminOverview } from "@/lib/admin/types";
import {
  OverviewBarChart,
  OverviewDonutChart,
} from "@/components/charts/overview-charts";
import { buttonVariants } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const rolesChartConfig = {
  customers: { label: "Customers", color: "var(--primary)" },
  vendors: { label: "Vendors", color: "var(--secondary)" },
  admins: { label: "Admins", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const menuChartConfig = {
  approved: { label: "Approved", color: "var(--success)" },
  pending: { label: "Pending", color: "var(--warning)" },
} satisfies ChartConfig;

function OverviewSkeleton() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="gap-3 p-5">
          <Skeleton className="size-5 w-5 rounded-md" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </Card>
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <Card className="mt-8 items-center gap-2 py-12 text-center">
      <p className="font-medium">Unable to load the platform overview</p>
      <p className="text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </Card>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`gap-3 p-5 ${
        highlight
          ? "border-amber-300/70 bg-amber-50/40 dark:border-amber-400/20 dark:bg-amber-400/5"
          : ""
      }`}
    >
      {highlight ? (
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

function OverviewContent({ data }: { data: AdminOverview }) {
  const stats: {
    label: string;
    value: number;
    icon: LucideIcon;
    highlight?: boolean;
  }[] = [
    {
      label: "Registered users",
      value: data.totalRegisteredUsers,
      icon: UsersRound,
    },
    { label: "Vendors", value: data.totalVendors, icon: Store },
    { label: "Customers", value: data.totalCustomers, icon: UserRound },
    { label: "Menu items", value: data.totalMenuItems, icon: Pizza },
    {
      label: "Pending review",
      value: data.pendingMenuItems,
      icon: Clock3,
      highlight: data.pendingMenuItems > 0,
    },
    {
      label: "Transactions",
      value: data.totalTransactions,
      icon: CreditCard,
    },
  ];

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OverviewDonutChart
          title="User roles"
          description="How the platform audience is split"
          data={[
            {
              key: "customers",
              label: "Customers",
              value: data.totalCustomers,
            },
            { key: "vendors", label: "Vendors", value: data.totalVendors },
            {
              key: "admins",
              label: "Admins",
              value: Math.max(
                0,
                data.totalRegisteredUsers -
                  data.totalCustomers -
                  data.totalVendors,
              ),
            },
          ]}
          config={rolesChartConfig}
        />
        <OverviewBarChart
          title="Menu moderation"
          description="Approved vs pending items"
          data={[
            {
              key: "approved",
              label: "Approved",
              value: Math.max(
                0,
                data.totalMenuItems - data.pendingMenuItems,
              ),
            },
            {
              key: "pending",
              label: "Pending",
              value: data.pendingMenuItems,
            },
          ]}
          config={menuChartConfig}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/admin/users"
          className={buttonVariants({ size: "sm" })}
        >
          Manage users
        </Link>
        <Link
          href="/dashboard/admin/menu-items"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          {data.pendingMenuItems > 0
            ? `Review ${data.pendingMenuItems} pending item${data.pendingMenuItems === 1 ? "" : "s"}`
            : "Review menu items"}
        </Link>
        <Link
          href="/dashboard/admin/transactions"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View transactions
        </Link>
      </div>
    </div>
  );
}

async function OverviewLoader() {
  let data: AdminOverview;

  try {
    data = await getAdminOverview();
  } catch (error) {
    unstable_rethrow(error);
    return <ErrorState />;
  }

  return <OverviewContent data={data} />;
}

export default function AdminOverviewPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {dashboardLinks.admin[0].label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.admin[0].description}
      </p>

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewLoader />
      </Suspense>
    </section>
  );
}
