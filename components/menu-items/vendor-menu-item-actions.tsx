"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  deleteMenuItem,
  setMenuItemAvailability,
} from "@/lib/menu-items/actions";
import type { MenuItem } from "@/lib/menu-items/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";

type Props = {
  item: MenuItem;
};

export function VendorMenuItemActions({ item }: Props) {
  const router = useRouter();
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [deleting, startDeleteTransition] = useTransition();

  const canToggle = item.status === "approved" || item.status === "inactive";
  const isAvailable = item.status === "approved";

  async function handleToggleAvailability(checked: boolean) {
    setTogglingAvailability(true);
    try {
      await setMenuItemAvailability(item._id, checked);
      toast.add({
        title: checked ? "Item set to available" : "Item set to unavailable",
        description: checked
          ? `"${item.itemName}" is now visible to customers.`
          : `"${item.itemName}" is now hidden from customers.`,
        type: "success",
        timeout: 4000,
      });
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Failed to update availability",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setTogglingAvailability(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete "${item.itemName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    startDeleteTransition(async () => {
      try {
        await deleteMenuItem(item._id);
        toast.add({
          title: "Menu item deleted",
          description: `"${item.itemName}" has been removed.`,
          type: "success",
          timeout: 4000,
        });
        router.refresh();
      } catch (error) {
        toast.add({
          title: "Delete failed",
          description:
            error instanceof Error
              ? error.message
              : "Unable to delete the item. Please try again.",
          type: "error",
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {canToggle && (
        <div className="flex items-center gap-2">
          <Switch
            checked={isAvailable}
            disabled={togglingAvailability}
            onCheckedChange={handleToggleAvailability}
            aria-label={isAvailable ? "Mark as unavailable" : "Mark as available"}
          />
          <span className="text-xs text-muted-foreground">
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={deleting}
        onClick={() =>
          router.push(`/dashboard/vendor/menu-items/${item._id}/edit`)
        }
      >
        Edit
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={deleting}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
        onClick={handleDelete}
      >
        {deleting ? "Deleting…" : "Delete"}
      </Button>
    </div>
  );
}
