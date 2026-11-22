import { redirect } from "next/navigation";
import { USER_ROLES, type UserRole } from "@/lib/roles";
import { requireActiveSession } from "@/lib/server-session";

export async function requireRole(requiredRole: UserRole) {
  const session = await requireActiveSession();

  const role = session.user.role;
  const currentRole = USER_ROLES.includes(role as UserRole)
    ? (role as UserRole)
    : "customer";

  if (currentRole !== requiredRole) {
    redirect(`/dashboard/${currentRole}`);
  }
}

