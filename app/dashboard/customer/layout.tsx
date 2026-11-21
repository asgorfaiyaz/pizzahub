import type { ReactNode } from "react";
import { requireRole } from "@/app/dashboard/lib/require-role";
export const instant = false;
export default async function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("customer");
  return children;
}
