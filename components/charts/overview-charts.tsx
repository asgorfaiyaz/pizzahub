"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Sector,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

export type ChartDatum = {
  key: string;
  label: string;
  value: number;
};

function ChartHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function OverviewBarChart({
  title,
  description,
  data,
  config,
}: {
  title: string;
  description?: string;
  data: ChartDatum[];
  config: ChartConfig;
}) {
  return (
    <Card className="p-5">
      <ChartHeader title={title} description={description} />
      <ChartContainer config={config} className="aspect-[3/2] max-h-64">
        <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="label" hideLabel />}
          />
          <Bar
            dataKey="value"
            radius={6}
            maxBarSize={56}
            shape={(props) => (
              <rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                rx={6}
                fill={`var(--color-${(props.payload as ChartDatum).key})`}
              />
            )}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}

export function OverviewDonutChart({
  title,
  description,
  data,
  config,
}: {
  title: string;
  description?: string;
  data: ChartDatum[];
  config: ChartConfig;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-5">
      <ChartHeader title={title} description={description} />
      <ChartContainer config={config} className="aspect-[3/2] max-h-64">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={3}
            stroke="none"
            shape={(props) => (
              <Sector
                {...props}
                fill={`var(--color-${(props.payload as ChartDatum).key})`}
              />
            )}
          />
          <ChartTooltip
            content={<ChartTooltipContent nameKey="label" hideLabel />}
          />
        </PieChart>
      </ChartContainer>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        {data.map((item) => (
          <span key={item.key} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: `var(--color-${item.key})` }}
            />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold tabular-nums">{item.value}</span>
          </span>
        ))}
        {total === 0 ? (
          <span className="text-muted-foreground">No data yet</span>
        ) : null}
      </div>
    </Card>
  );
}
