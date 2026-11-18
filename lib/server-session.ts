import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** Read the current Better Auth session from a Server Component or other server context. */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}
