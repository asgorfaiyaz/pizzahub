import { notFound } from "next/navigation";
import Link from "next/link";

import { getMenuItemById } from "@/lib/menu-items/queries";
import { MenuItemForm } from "@/components/menu-items/menu-item-form";
import { ChevronRight } from "lucide-react";

export const instant = false;

export default async function VendorEditMenuItemPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let item;
  try {
    item = await getMenuItemById(id);
  } catch {
    notFound();
  }
  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/dashboard/vendor/menu-items"
          className="hover:text-foreground transition-colors"
        >
          My Menu Items
        </Link>
        <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        <span className="text-foreground font-medium truncate max-w-50">
          {item.itemName}
        </span>
        <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">Edit</span>
      </nav>

      <h1 className="text-3xl font-semibold tracking-tight">Edit Menu Item</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        Update the details of <strong>{item.itemName}</strong>. Any changes will
        be saved immediately.
      </p>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <MenuItemForm
          mode="update"
          menuItemId={id}
          defaultValues={item}
          returnTo="/dashboard/vendor/menu-items"
        />
      </div>
    </section>
  );
}
