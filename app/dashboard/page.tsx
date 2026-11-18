import { redirect } from "next/navigation";
import { USER_ROLES, type UserRole } from "@/lib/roles";
import { getServerSession } from "@/lib/server-session";
export const instant = false;
export default async function DashboardIndexPage() {
  const session = await getServerSession();
  const role = session?.user.role;
  const destination = USER_ROLES.includes(role as UserRole) ? role : "customer";

  redirect(`/dashboard/${destination}`);
}
