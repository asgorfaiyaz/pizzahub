"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

function DashboardAwareShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboard) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <DashboardAwareShell>{children}</DashboardAwareShell>
    </Suspense>
  );
}
