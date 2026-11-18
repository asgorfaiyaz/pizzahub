import type { DashboardLink } from "@/app/dashboard/lib/dashboard-links";

export function DashboardPage({ item }: { item: DashboardLink }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {item.label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {item.description}
      </p>
      <div className="mt-8 rounded-xl border border-dashed bg-card/50 p-6 text-sm text-muted-foreground">
        This page is ready for {item.label.toLowerCase()} content.
      </div>
    </section>
  );
}
