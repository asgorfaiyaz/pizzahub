import { CheckCircle2, Clock3, Package, XCircle, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { Card } from "@/components/ui/card";
import type { CustomerOverview } from "@/lib/orders/types";

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: "primary" | "warning" | "success" | "muted";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/10 text-success",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="gap-3 p-5">
      <span
        className={`flex size-9 items-center justify-center rounded-lg ${tones[tone]}`}
      >
        <Icon className="size-4" />
      </span>
      <p className="text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

export function CustomerOrdersStats({
  overview,
}: {
  overview: CustomerOverview;
}) {
  const tiles = [
    { icon: Package, label: "Total orders", value: overview.total, tone: "primary" as const },
    { icon: Clock3, label: "Pending", value: overview.pending, tone: "warning" as const },
    { icon: CheckCircle2, label: "Accepted", value: overview.accepted, tone: "success" as const },
    { icon: XCircle, label: "Cancelled / rejected", value: overview.cancelled + overview.rejected, tone: "muted" as const },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, index) => (
        <Reveal key={tile.label} delay={index * 0.05}>
          <StatTile {...tile} />
        </Reveal>
      ))}
    </div>
  );
}
