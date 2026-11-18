import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import {
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { USER_ROLES, type UserRole } from "@/lib/roles";
import { getServerSession } from "@/lib/server-session";
export const instant = false;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

async function DashboardContent({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (!session) redirect("/sign-in");

  const sessionRole = session.user.role;
  const role: UserRole = USER_ROLES.includes(sessionRole as UserRole)
    ? (sessionRole as UserRole)
    : "customer";

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <main className="relative flex min-h-svh w-full flex-1 flex-col overflow-hidden bg-background">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6">
          <SidebarTrigger />
          <SidebarSeparator orientation="vertical" className="mx-0 h-4" />
          <span className="text-sm font-medium text-foreground">Dashboard</span>
        </header>
        <div className="min-h-0 flex-1 px-5 py-8 md:px-8 md:py-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

function DashboardLoading() {
  return (
    <div
      className="flex min-h-svh w-full bg-background"
      role="status"
      aria-label="Loading dashboard"
      aria-busy="true"
    >
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
        <div className="flex h-12 items-center gap-3 px-2">
          <div className="size-8 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <div className="mb-3 h-2.5 w-14 animate-pulse rounded bg-muted" />
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex h-9 items-center gap-3 rounded-md px-2"
            >
              <div className="size-4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6">
          <div className="size-8 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </header>
        <main className="w-full flex-1 px-5 py-8 md:px-8 md:py-10">
          <div className="max-w-5xl">
            <div className="h-8 w-56 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-3/4 max-w-md animate-pulse rounded bg-muted" />
            <div className="mt-8 h-28 w-full animate-pulse rounded-xl border border-dashed bg-card/50" />
          </div>
        </main>
      </div>
      <span className="sr-only">Loading your dashboard…</span>
    </div>
  );
}
