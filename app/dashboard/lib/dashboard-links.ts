import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Pizza,
  Settings,
  ShoppingBag,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/roles";

export type DashboardLink = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const dashboardLinks: Record<UserRole, DashboardLink[]> = {
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", description: "A quick look at your shop and its activity.", icon: LayoutDashboard },
    { label: "My Menu Items", href: "/dashboard/vendor/menu-items", description: "View the pizza and other items on your menu.", icon: Pizza },
    { label: "Add Menu Item", href: "/dashboard/vendor/add-menu-item", description: "See where new menu items will be added.", icon: ShoppingBag },
    { label: "Customer Orders", href: "/dashboard/vendor/orders", description: "Review orders placed with your shop.", icon: ClipboardList },
    { label: "Subscription", href: "/dashboard/vendor/subscription", description: "View your PizzaHub subscription details.", icon: CreditCard },
    { label: "Profile Settings", href: "/dashboard/vendor/profile-settings", description: "Manage your vendor profile and preferences.", icon: Settings },
    { label: "Restaurant Info", href: "/dashboard/vendor/restaurant-info", description: "View your restaurant location and opening hours.", icon: Store },
  ],
  customer: [
    { label: "Overview", href: "/dashboard/customer", description: "A quick look at your PizzaHub account.", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/customer/orders", description: "View the orders you have placed.", icon: ClipboardList },
    { label: "Profile Settings", href: "/dashboard/customer/profile-settings", description: "Manage your account details and preferences.", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", description: "A summary of PizzaHub platform activity.", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", description: "View and manage PizzaHub user accounts.", icon: Users },
    { label: "Manage Menu Items", href: "/dashboard/admin/menu-items", description: "Review menu items listed across the platform.", icon: Pizza },
    { label: "Transactions", href: "/dashboard/admin/transactions", description: "View payments and platform transactions.", icon: CreditCard },
  ],
};

export const dashboardRoleMeta = {
  vendor: { label: "Vendor workspace", icon: Store },
  customer: { label: "Customer workspace", icon: ShoppingBag },
  admin: { label: "Admin workspace", icon: Users },
} satisfies Record<UserRole, { label: string; icon: LucideIcon }>;

