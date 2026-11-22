"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS } from "@/lib/roles";
import { getDashboardHref, type NavUser } from "./nav-config";

type ProfileMenuProps = {
  user: NavUser;
  onLogout?: () => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-md p-1.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar size="sm">
          {user.image ? (
            <AvatarImage src={user.image} alt={`${user.name} profile`} />
          ) : null}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="max-w-32 truncate text-sm font-medium text-foreground">
          {user.name}
        </span>
        <ChevronDown
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="truncate font-medium text-foreground">{user.name}</p>
            {user.role ? (
              <p className="truncate text-xs font-medium text-primary">
                {ROLE_LABELS[user.role]}
              </p>
            ) : null}
            {user.email ? (
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={getDashboardHref(user.role)} />}>
          <LayoutDashboard aria-hidden="true" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/profile-settings" />}>
          <Settings aria-hidden="true" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
