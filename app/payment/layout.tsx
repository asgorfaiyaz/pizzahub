import type { ReactNode } from "react";

import { requireRole } from "@/app/dashboard/lib/require-role";

export const instant = false;

export default async function PaymentLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("vendor");
  return children;
}
