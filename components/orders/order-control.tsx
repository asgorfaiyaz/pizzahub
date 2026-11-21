"use client";

import { useState } from "react";
import { ShoppingBagIcon } from "lucide-react";

import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/orders/order-form";

type OrderControlProps = {
  itemId: string;
  itemName: string;
  price: number;
};

export function OrderControl({ itemId, itemName, price }: OrderControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button size="lg" onClick={() => setIsOpen(true)}>
        <ShoppingBagIcon />
        Order now
      </Button>

      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <OrderForm
            itemId={itemId}
            itemName={itemName}
            price={price}
            onClose={() => setIsOpen(false)}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
