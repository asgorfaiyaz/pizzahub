"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, Home, LogOut, Pizza, Settings } from "lucide-react";

import {
  dashboardLinks,
  dashboardRoleMeta,
} from "@/app/dashboard/lib/dashboard-links";
import { ROLE_LABELS, type UserRole } from "@/lib/roles";
import { authClient } from "@/lib/auth-client";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";

export type DashboardSidebarUser = {
  name: string;
  email?: string | null;
  image?: string | null;
};

type DashboardSidebarProps = {
  role: UserRole;
  user: DashboardSidebarUser;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardSidebar({ role, user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const links = dashboardLinks[role];
  const roleMeta = dashboardRoleMeta[role];

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.add({
          title: "Sign out failed",
          description:
            result.error.message ?? "Unable to sign out. Please try again.",
          type: "error",
          timeout: 5000,
        });
        return;
      }

      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.add({
        title: "Sign out failed",
        description: "Something went wrong. Please try again.",
        type: "error",
        timeout: 5000,
      });
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              size="lg"
              tooltip="PizzaHub home"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-4">
                <Pizza
                  className="size-4 shrink-0 group-data-[collapsible=icon]:size-3"
                  aria-hidden="true"
                />
              </span>
              {isCollapsed ? null : (
                <span className="flex min-w-0 flex-col items-start gap-1 leading-none">
                  <span className="font-semibold">PizzaHub</span>
                  <span className="text-xs font-normal text-sidebar-foreground/65">
                    {roleMeta.label}
                  </span>
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleMeta.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/" />}
                  tooltip="Home"
                >
                  <Home aria-hidden="true" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {links.map((item) => {
                const active =
                  item.href === `/dashboard/${role}`
                    ? pathname === item.href
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton tooltip="Account" />}
              >
                <Avatar className="size-8 shrink-0 group-data-[collapsible=icon]:size-4">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={`${user.name} profile`} />
                  ) : null}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                {isCollapsed ? null : (
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 leading-none">
                    <span className="w-full truncate text-sm font-medium">
                      {user.name}
                    </span>
                    <span className="w-full truncate text-xs text-muted-foreground">
                      {user.email ?? ROLE_LABELS[role]}
                    </span>
                  </span>
                )}
                {isCollapsed ? null : (
                  <ChevronsUpDown
                    className="ml-auto size-4 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <p className="truncate font-medium text-foreground">
                      {user.name}
                    </p>
                    {user.email ? (
                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs font-medium text-primary">
                      {ROLE_LABELS[role]}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile-settings" />}>
                  <Settings aria-hidden="true" />
                  Profile settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  <LogOut aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
