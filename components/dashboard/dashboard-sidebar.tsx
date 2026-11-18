"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza } from "lucide-react";
import {
  dashboardLinks,
  dashboardRoleMeta,
} from "@/app/dashboard/lib/dashboard-links";
import type { UserRole } from "@/lib/roles";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = dashboardLinks[role];
  const roleMeta = dashboardRoleMeta[role];

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
              <span className="flex min-w-0 flex-col items-start gap-1 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">PizzaHub</span>
                <span className="text-xs font-normal text-sidebar-foreground/65">
                  {roleMeta.label}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
    </Sidebar>
  );
}
