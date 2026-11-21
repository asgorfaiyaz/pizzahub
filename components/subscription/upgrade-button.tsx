"use client";

import { Button } from "@/components/ui/button";

export function UpgradeButton() {
  return (
    <Button onClick={() => console.log("clicked")}>Upgrade to Premium</Button>
  );
}
