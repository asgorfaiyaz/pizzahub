import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getVendorMenuItems } from "@/lib/menu-items/queries";
import { Badge } from "@/components/ui/badge";
export const instant = false;
export default async function VendorMenuItemsPage() {
  const items = await getVendorMenuItems();

  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {dashboardLinks.vendor[1].label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.vendor[1].description}
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed bg-card/50 p-6 text-sm text-muted-foreground">
          You haven’t added any menu items yet.
        </div>
      ) : (
        <ul className="mt-8 divide-y rounded-xl border bg-card">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <h2 className="truncate font-medium">{item.itemName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.category} · {item.location} · ${item.price.toFixed(2)}
                </p>
              </div>
              <Badge
                variant={
                  item.status === "approved"
                    ? "secondary"
                    : item.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
                className="capitalize"
              >
                {item.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
