"use client"

import { authClient } from "@/lib/auth-client"
import type { NavUser } from "@/components/navbar/nav-config"

export type AuthSessionState = {
  user?: NavUser
  isAuthenticated: boolean
  isPending: boolean
  authState: "loading" | "authenticated" | "unauthenticated"
}

export function useAuthSession(): AuthSessionState {
  const { data: session, isPending } = authClient.useSession()
  const user: NavUser | undefined = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? undefined,
        role: session.user.role ?? undefined,
      }
    : undefined
  const isAuthenticated = !!user

  return {
    user,
    isAuthenticated,
    isPending,
    authState: isPending
      ? "loading"
      : isAuthenticated
        ? "authenticated"
        : "unauthenticated",
  }
}
