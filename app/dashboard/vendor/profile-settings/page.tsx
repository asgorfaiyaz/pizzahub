import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";

export default function VendorProfileSettingsPage() {
  return <DashboardPage item={dashboardLinks.vendor[5]} />;
}

