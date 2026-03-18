"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  Blocks,
  CalendarDays,
  Crown,
  Gauge,
  Shield,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
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
  SidebarRail,
} from "@/components/ui/sidebar";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: Gauge },
      { href: "/admin/leagues", label: "League Manager", icon: Trophy },
    ],
  },
  {
    title: "League Operations",
    items: [
      { href: "/admin/seasons", label: "Seasons", icon: CalendarDays },
      { href: "/admin/squad", label: "Squads", icon: Users },
      { href: "/admin/global-bets", label: "Global Bets", icon: Crown },
      { href: "/admin/competitions", label: "Competitions", icon: Swords },
    ],
  },
  {
    title: "Catalogs",
    items: [
      { href: "/admin/communities", label: "Communities", icon: Shield },
      { href: "/admin/teams", label: "Teams", icon: Users },
      { href: "/admin/players", label: "Players", icon: Blocks },
    ],
  },
  {
    title: "Fixtures",
    items: [
      { href: "/admin/match-days", label: "Match Days", icon: CalendarDays },
      { href: "/admin/matches", label: "Matches", icon: Swords },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Pelotus Admin</p>
            <p className="truncate text-xs text-sidebar-foreground/70">Control Room</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href} aria-current={active ? "page" : undefined}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        <p className="px-2 py-1 text-xs text-sidebar-foreground/70">
          Manage leagues, squads, fixtures, and outcomes.
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
