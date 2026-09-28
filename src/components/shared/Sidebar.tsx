"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Send,
  UserCog,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/uiStore";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: MessageSquare,
    badge: 9,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Send,
  },
  {
    title: "Team",
    href: "/team",
    icon: UserCog,
  },
  {
    title: "Automation",
    href: "/automation",
    icon: GitBranch,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "AM";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        aria-label="Sidebar Navigation"
        className={cn(
          "relative flex h-full flex-col justify-between border-r border-border bg-card/90 backdrop-blur-md transition-all duration-300 ease-in-out select-none z-30",
          sidebarCollapsed ? "w-[72px]" : "w-64",
        )}
      >
        {/* Top: Logo & Collapse Button */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/60">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all duration-200",
              sidebarCollapsed && "justify-center w-full",
            )}
          >
            <Image
              src="/logo.png"
              alt="WhatsApp CRM Logo"
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
              priority
            />
            {!sidebarCollapsed && (
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="font-bold text-sm tracking-tight text-foreground whitespace-nowrap">
                  WhatsApp CRM
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Enterprise Hub
                </span>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground shrink-0 size-7"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
        </div>

        {/* Middle: Navigation Items */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  sidebarCollapsed && "justify-center px-0 py-2.5",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-transform group-hover:scale-105",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />

                {!sidebarCollapsed && <span className="flex-1 truncate">{item.title}</span>}

                {!sidebarCollapsed && item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-auto size-5 p-0 flex items-center justify-center text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full"
                  >
                    {item.badge}
                  </Badge>
                )}

                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-1.5 right-2 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                )}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="size-4 p-0 flex items-center justify-center text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>

        {/* Bottom: Demo Badge & User Profile */}
        <div className="p-3 border-t border-border/60 space-y-3">
          {/* Demo Data Badge */}
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-amber-500"></span>
                </span>
                <span className="font-semibold text-[11px] tracking-wide uppercase">
                  Demo Data Mode
                </span>
              </div>
              <span className="text-[10px] opacity-75">Mock API</span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center py-1">
                  <span className="size-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Demo Data Mode Active</TooltipContent>
            </Tooltip>
          )}

          {/* User Account Card */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-1.5 transition-colors",
              sidebarCollapsed ? "justify-center" : "bg-muted/50 border border-border/40",
            )}
          >
            {sidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar className="size-8 rounded-lg ring-1 ring-border">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
                      <AvatarFallback className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold text-xs">{user?.name || "Arjun Mehta"}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {user?.role || "Admin"}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <>
                <Avatar className="size-8 rounded-lg ring-1 ring-border">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {user?.name || "Arjun Mehta"}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground capitalize">
                    {user?.role || "Admin"} • {user?.email || "arjun@mindclub.com"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Expand Button when collapsed */}
          {sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleSidebar}
              className="w-full h-8 text-muted-foreground hover:text-foreground"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
