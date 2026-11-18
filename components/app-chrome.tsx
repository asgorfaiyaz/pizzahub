"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboard) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
