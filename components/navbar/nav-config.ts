import type { UserRole } from "@/lib/roles";

export type NavItem = {
  label: string;
  href: string;
};

export type NavUser = {
  name: string;
  email?: string;
  image?: string;
  role?: UserRole;
};

export const publicNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/browse-menu" },
];

export const authenticatedNavItems: NavItem[] = [
  ...publicNavItems,
  { label: "Dashboard", href: "/dashboard" },
];
