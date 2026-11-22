import Link from "next/link";
import { Pizza } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CustomerOrdersEmpty() {
  return (
    <Card className="items-center gap-3 border-dashed bg-card/50 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Pizza className="size-7 text-primary" aria-hidden />
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">No orders yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Your order history will appear here. Explore the menu and find
          something delicious to enjoy.
        </p>
      </div>
      <Link href="/browse-menu" className={buttonVariants({ size: "sm" })}>
        Browse menu
      </Link>
    </Card>
  );
}
