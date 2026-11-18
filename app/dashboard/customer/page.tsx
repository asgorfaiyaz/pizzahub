import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";

export default function CustomerOverviewPage() {
  return <DashboardPage item={dashboardLinks.customer[0]} />;
}

