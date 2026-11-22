"use client";

import { useState } from "react";
import { useRouter, unstable_rethrow } from "next/navigation";
import {
  CheckIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";

import {
  deleteAdminMenuItem,
  setAdminMenuItemStatus,
} from "@/lib/menu-items/actions";
import type { MenuItemStatus } from "@/lib/menu-items/types";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

const statusOptions: { value: MenuItemStatus; label: string }[] = [
  { value: "pending", label: "Set pending" },
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
  { value: "inactive", label: "Set inactive" },
];

type AdminMenuItemActionsProps = {
  id: string;
  itemName: string;
  status: MenuItemStatus;
};

export function AdminMenuItemActions({
  id,
  itemName,
  status,
}: AdminMenuItemActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  async function handleStatus(nextStatus: MenuItemStatus) {
    if (isBusy || nextStatus === status) return;

    setIsBusy(true);

    try {
      const result = await setAdminMenuItemStatus(id, nextStatus);

      if (!result.success) {
        throw new Error(result.message || "Failed to update the item status.");
      }

      toast.add({
        title: "Status updated",
        description: result.message,
        type: "success",
        timeout: 5000,
      });
      router.refresh();
    } catch (error) {
      unstable_rethrow(error);
      toast.add({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update the menu item. Please try again.",
        type: "error",
        timeout: 5000,
      });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete() {
    if (isBusy) return;

    setIsBusy(true);

    try {
      const result = await deleteAdminMenuItem(id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete the item.");
      }

      setIsDeleteOpen(false);
      toast.add({
        title: "Menu item deleted",
        description: result.message,
        type: "success",
        timeout: 5000,
      });
      router.refresh();
    } catch (error) {
      unstable_rethrow(error);
      toast.add({
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete the menu item. Please try again.",
        type: "error",
        timeout: 5000,
      });
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isBusy}
              aria-label={`Actions for ${itemName}`}
            />
          }
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Change status</DropdownMenuLabel>
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                disabled={isBusy || option.value === status}
                onClick={() => handleStatus(option.value)}
              >
                {option.value === status ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <span className="size-4" />
                )}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              disabled={isBusy}
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2Icon />
              Delete item
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemName} will be permanently removed. This action cannot be
              undone.
            </AlertDialogDescription>

            <div className="mt-5 flex justify-end gap-2">
              <AlertDialogClose
                render={<Button variant="ghost" size="sm" disabled={isBusy} />}
              >
                Cancel
              </AlertDialogClose>
              <Button
                variant="destructive"
                size="sm"
                disabled={isBusy}
                onClick={handleDelete}
              >
                {isBusy ? "Deleting…" : "Delete item"}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
}
