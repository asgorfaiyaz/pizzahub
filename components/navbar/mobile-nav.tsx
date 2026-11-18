"use client";

import Link from "next/link";
import { Menu, Pizza } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "./nav-link";
import type { NavItem, NavUser } from "./nav-config";
import { ProfileMenu } from "./profile-menu";

type MobileNavProps = {
  items: NavItem[];
  authState: "loading" | "authenticated" | "unauthenticated";
  user?: NavUser;
  onLogout?: () => void;
};

export function MobileNav({ items, authState, user, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle className="flex items-center gap-2">
            <Pizza className="size-5 text-primary" aria-hidden="true" />
            PizzaHub
          </SheetTitle>
          <SheetDescription>Find your next favorite slice.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 px-4 py-2">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {items.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
          {authState === "authenticated" && user ? (
            <div className="flex items-center border-t border-border pt-5">
              <ProfileMenu user={user} onLogout={onLogout} />
            </div>
          ) : authState === "loading" ? (
            <div className="mt-auto border-t border-border pt-5">
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <div className="mt-auto grid gap-2 border-t border-border pt-5">
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "outline" })}
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={buttonVariants()}
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
