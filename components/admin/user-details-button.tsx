"use client";

import { useState } from "react";
import { CalendarDays, Eye, Fingerprint, Mail, Phone } from "lucide-react";

import { fetchUserDetails } from "@/lib/admin/actions";
import type { User } from "@/lib/admin/types";
import { ROLE_LABELS, type UserRole } from "@/lib/roles";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function roleVariant(role: string): "default" | "secondary" | "outline" {
  if (role === "admin") return "default";
  if (role === "vendor") return "secondary";
  return "outline";
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`mt-0.5 break-all font-medium ${mono ? "font-mono text-xs" : "text-sm"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function UserDetailsButton({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setIsOpen(true);
    setUser(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await fetchUserDetails(id);

      if (result.ok) setUser(result.user);
      else setError(result.message);
    } catch {
      setError("Unable to load user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={handleOpen}
        aria-label={`View details for ${name}`}
        title={`View details for ${name}`}
      >
        <Eye className="size-3.5" />
      </Button>

      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <DialogTitle>User details</DialogTitle>
            <DialogDescription className="mt-1">
              Full account information for this user.
            </DialogDescription>

            <div className="mt-5 min-h-40">
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  {error}
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                      {user.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : null}
                      <Badge variant={roleVariant(user.role)}>
                        {ROLE_LABELS[user.role as UserRole] ?? user.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-xl border bg-muted/30 p-4">
                    <DetailRow
                      icon={Mail}
                      label="Email"
                      value={user.email}
                    />
                    <DetailRow
                      icon={Phone}
                      label="Phone"
                      value={user.phone || "Not provided"}
                    />
                    <DetailRow
                      icon={CalendarDays}
                      label="Joined"
                      value={formatDate(user.createdAt)}
                    />
                    <DetailRow
                      icon={Fingerprint}
                      label="User ID"
                      value={user._id}
                      mono
                    />
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              <DialogClose
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Close
              </DialogClose>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
