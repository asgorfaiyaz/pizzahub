import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";

export default function AdminOverviewPage() {
  return <DashboardPage item={dashboardLinks.admin[0]} />;
}

