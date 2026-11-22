import { Check, Info, Truck } from "lucide-react";

import { OrderControl } from "@/components/orders/order-control";
import { Reveal } from "@/components/home/reveal";
import { Card } from "@/components/ui/card";

type MenuDetailOrderCardProps = {
  itemId: string;
  itemName: string;
  price: number;
  canOrder: boolean;
  reason: string | null;
};

export function MenuDetailOrderCard({
  itemId,
  itemName,
  price,
  canOrder,
  reason,
}: MenuDetailOrderCardProps) {
  return (
    <Reveal delay={0.15}>
      <Card className="gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ready to order?
            </p>
            <p className="mt-1 text-lg font-semibold">
              ${price.toFixed(2)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <Check className="size-3.5" />
            Made fresh
          </span>
        </div>

        {canOrder ? (
          <OrderControl
            itemId={itemId}
            itemName={itemName}
            price={price}
          />
        ) : (
          <div className="flex items-start gap-2.5 rounded-xl border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{reason}</p>
          </div>
        )}

        <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
          <Truck className="size-4 shrink-0 text-primary" aria-hidden />
          Delivered warm by your local PizzaHub kitchen
        </div>
      </Card>
    </Reveal>
  );
}
