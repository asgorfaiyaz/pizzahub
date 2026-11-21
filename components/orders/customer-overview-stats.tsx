import type { CustomerOverview } from "@/lib/orders/types";

const OVERVIEW_STATS = [
  { key: "total", label: "Total" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
] as const;

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

export function CustomerOverviewStats({
  overview,
}: {
  overview: CustomerOverview;
}) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {OVERVIEW_STATS.map(({ key, label }) => (
        <StatCard key={key} label={label} value={overview[key]} />
      ))}
    </div>
  );
}
