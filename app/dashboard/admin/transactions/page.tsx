import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";

export default function AdminTransactionsPage() {
  return <DashboardPage item={dashboardLinks.admin[3]} />;
}

