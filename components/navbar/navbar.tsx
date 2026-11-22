"use client";

import Link from "next/link";
import { Pizza } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useAuthSession } from "@/hooks/use-auth-session";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { authenticatedNavItems, publicNavItems } from "./nav-config";
import { ProfileMenu } from "./profile-menu";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, authState } = useAuthSession();
  const items = isAuthenticated ? authenticatedNavItems : publicNavItems;

  async function handleLogout() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.add({
          title: "Logout failed",
          description:
            result.error.message ?? "Unable to log out. Please try again.",
          type: "error",
        });
        return;
      }

      router.refresh();
    } catch {
      toast.add({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }

  return (
    <header className="sticky top-0 z-40  bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md font-heading text-lg font-semibold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Pizza className="size-5 text-primary" aria-hidden="true" />
          PizzaHub
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {items.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {authState === "authenticated" && user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : authState === "loading" ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <>
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign In
              </Link>
              <Link href="/sign-up" className={buttonVariants()}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <MobileNav
            items={items}
            authState={authState}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
