import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";

export default function AdminUsersPage() {
  return <DashboardPage item={dashboardLinks.admin[1]} />;
}

