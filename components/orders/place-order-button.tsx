"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createOrder } from "@/lib/orders/actions";

type PlaceOrderButtonProps = {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
};

export function PlaceOrderButton({
  itemId,
  deliveryDate,
  deliveryAddress,
  message,
}: PlaceOrderButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handlePlace() {
    try {
      const result = await createOrder({
        itemId,
        deliveryDate: deliveryDate.trim(),
        deliveryAddress: deliveryAddress.trim(),
        message: message?.trim() || undefined,
      });

      if (!result.success) {
        throw new Error(
          result.message || "Failed to place your order. Please try again.",
        );
      }

      toast.add({
        title: "Order placed",
        description: "Your order has been placed. We'll deliver it soon.",
        type: "success",
        timeout: 5000,
      });

      startTransition(() => {
        router.push("/dashboard/customer/orders");
      });
    } catch (error) {
      toast.add({
        title: "Order failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to place your order. Please try again.",
        type: "error",
        timeout: 5000,
      });
    }
  }

  return (
    <Button size="lg" disabled={isPending} onClick={handlePlace}>
      {isPending ? "Placing…" : "Place order"}
    </Button>
  );
}
