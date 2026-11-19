import { MenuItemForm } from "@/components/menu-items/menu-item-form";

export default function VendorAddMenuItemPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">Add Menu Item</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        Add a new item to your shop menu. New items are submitted for approval.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6">
        <MenuItemForm />
      </div>
    </section>
  );
}

