"use client";

import { useState, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createCheckoutSession } from "@/lib/subscriptions/actions";

type UpgradeButtonProps = Pick<
  ComponentProps<typeof Button>,
  "className" | "size"
>;

export function UpgradeButton({ className, size }: UpgradeButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpgrade() {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await createCheckoutSession();

      if (!result.ok) {
        toast.add({
          title: "Upgrade failed",
          description: result.message,
          type: "error",
          timeout: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      window.location.href = result.url;
    } catch {
      toast.add({
        title: "Upgrade failed",
        description: "Unable to start checkout. Please try again.",
        type: "error",
        timeout: 5000,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      className={className}
      size={size}
      disabled={isSubmitting}
      onClick={handleUpgrade}
    >
      {isSubmitting ? "Redirecting…" : "Upgrade to Premium"}
    </Button>
  );
}
