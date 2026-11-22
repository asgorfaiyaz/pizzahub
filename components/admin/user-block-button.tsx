"use client";

import { useState } from "react";
import { Ban, ShieldCheck } from "lucide-react";

import { updateUserBlockStatus } from "@/lib/admin/actions";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type UserBlockButtonProps = {
  id: string;
  name: string;
  initialBlocked: boolean;
  isSelf: boolean;
};

export function UserBlockButton({
  id,
  name,
  initialBlocked,
  isSelf,
}: UserBlockButtonProps) {
  const [isBlocked, setIsBlocked] = useState(initialBlocked);
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const actionLabel = isBlocked ? `Unblock ${name}` : `Block ${name}`;

  async function handleConfirm() {
    setIsBusy(true);

    try {
      const result = await updateUserBlockStatus(id, !isBlocked);

      if (!result.ok) {
        toast.add({
          title: "Action failed",
          description: result.message,
          type: "error",
          timeout: 5000,
        });
        return;
      }

      setIsBlocked(Boolean(result.user.isBlocked));
      setIsOpen(false);
      toast.add({
        title: result.user.isBlocked ? "User blocked" : "User unblocked",
        description: result.user.isBlocked
          ? `${name}'s active sessions have been revoked.`
          : `${name} can access PizzaHub again.`,
        type: "success",
        timeout: 5000,
      });
    } catch {
      toast.add({
        title: "Action failed",
        description: "Unable to update the user's block status. Please try again.",
        type: "error",
        timeout: 5000,
      });
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-end gap-2">
        {isBlocked ? <Badge variant="destructive">Blocked</Badge> : null}
        <Button
          type="button"
          variant={isBlocked ? "secondary" : "outline"}
          size="icon-sm"
          disabled={isSelf || isBusy}
          onClick={() => setIsOpen(true)}
          aria-label={
            isSelf ? "You cannot block your own account" : actionLabel
          }
          title={
            isSelf ? "You cannot block your own account" : actionLabel
          }
        >
          {isBlocked ? (
            <ShieldCheck className="size-3.5" />
          ) : (
            <Ban className="size-3.5" />
          )}
        </Button>
      </div>

      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogTitle>
            {isBlocked ? "Unblock user?" : "Block user?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBlocked
              ? `${name} will be able to sign in and use PizzaHub again.`
              : `${name} will be signed out of every device immediately and will lose access to PizzaHub.`}
          </AlertDialogDescription>

          <div className="mt-5 flex justify-end gap-2">
            <AlertDialogClose
              render={<Button variant="ghost" size="sm" disabled={isBusy} />}
            >
              Cancel
            </AlertDialogClose>
            <Button
              variant={isBlocked ? "default" : "destructive"}
              size="sm"
              disabled={isBusy}
              onClick={handleConfirm}
            >
              {isBusy
                ? "Working…"
                : isBlocked
                  ? "Unblock user"
                  : "Block user"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
