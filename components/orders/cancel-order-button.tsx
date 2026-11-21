"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cancelOrder } from "@/lib/orders/actions";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type CancelOrderButtonProps = {
  orderId: string;
};

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isBusy = isCancelling || isPending;

  async function handleConfirm() {
    if (isBusy) return;

    setIsCancelling(true);

    try {
      await cancelOrder(orderId);

      toast.add({
        title: "Order cancelled",
        description: "Your order was cancelled successfully.",
        type: "success",
        timeout: 5000,
      });

      startTransition(() => {
        setIsOpen(false);
        router.refresh();
      });
    } catch (error) {
      toast.add({
        title: "Cancel failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to cancel your order. Please try again.",
        type: "error",
        timeout: 5000,
      });
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="sm"
        disabled={isBusy}
        onClick={() => setIsOpen(true)}
      >
        <Trash2Icon className="size-3.5" />
        Cancel
      </Button>

      <AlertDialogPortal>
        <AlertDialogBackdrop />

        <AlertDialogContent>
          <AlertDialogTitle>Cancel order?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </AlertDialogDescription>

          <div className="mt-5 flex justify-end gap-2">
            <AlertDialogClose
              render={<Button variant="ghost" size="sm" disabled={isBusy} />}
            >
              No, keep it
            </AlertDialogClose>

            <Button
              variant="destructive"
              size="sm"
              disabled={isBusy}
              onClick={handleConfirm}
            >
              {isBusy ? "Cancelling…" : "Cancel order"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
