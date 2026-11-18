export const USER_ROLES = ["customer", "vendor", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Administrator",
};
