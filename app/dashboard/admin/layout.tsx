import type { ReactNode } from "react";
import { requireRole } from "@/app/dashboard/lib/require-role";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireRole("admin");
  return children;
}

