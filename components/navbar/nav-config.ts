import { USER_ROLES, type UserRole } from "@/lib/roles";

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

export function getDashboardHref(role?: UserRole) {
  const safeRole = role && USER_ROLES.includes(role) ? role : "customer";

  return `/dashboard/${safeRole}`;
}

export function getAuthenticatedNavItems(role?: UserRole): NavItem[] {
  return [
    ...publicNavItems,
    { label: "Dashboard", href: getDashboardHref(role) },
  ];
}
