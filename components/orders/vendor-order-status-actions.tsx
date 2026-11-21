"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { updateVendorOrderStatus } from "@/lib/orders/actions";
import type { OrderStatus } from "@/lib/orders/types";

type VendorOrderStatusActionsProps = {
  orderId: string;
  status: OrderStatus;
};

export function VendorOrderStatusActions({
  orderId,
  status,
}: VendorOrderStatusActionsProps) {
  const router = useRouter();

  // Only pending orders can be accepted or rejected — and only once.
  if (status !== "pending") {
    return null;
  }

  async function handleAction(nextStatus: "accepted" | "rejected") {
    try {
      await updateVendorOrderStatus(orderId, nextStatus);

      toast.add({
        title:
          nextStatus === "accepted" ? "Order accepted" : "Order rejected",
        description:
          nextStatus === "accepted"
            ? "You accepted this order."
            : "You rejected this order.",
        type: "success",
        timeout: 5000,
      });

      router.refresh();
    } catch (error) {
      toast.add({
        title:
          nextStatus === "accepted"
            ? "Failed to accept order"
            : "Failed to reject order",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update the order status. Please try again.",
        type: "error",
        timeout: 5000,
      });
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        size="sm"
        variant="default"
        onClick={() => handleAction("accepted")}
      >
        Accept
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleAction("rejected")}
      >
        Reject
      </Button>
    </div>
  );
}
