"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Bell, User, Settings, LogOut, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/uiStore";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { toggleSidebar, setCommandOpen } = useUIStore();
  const { user, logout } = useAuth();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  // Generate breadcrumb items from pathname
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [{ label: "Dashboard", href: "/dashboard", isCurrent: true }];
    }

    return segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      return {
        label,
        href,
        isCurrent: idx === segments.length - 1,
      };
    });
  }, [pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "AM";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <TooltipProvider delayDuration={150}>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Left: Mobile Toggle + Breadcrumb Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden size-8 text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            <Menu className="size-4" />
          </Button>

          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              CRM
            </Link>

            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                {crumb.isCurrent ? (
                  <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium truncate max-w-[100px] sm:max-w-[160px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: Global Search trigger button */}
        <div className="hidden sm:flex items-center justify-center flex-1 max-w-md px-4">
          <button
            onClick={() => setCommandOpen(true)}
            className={cn(
              "flex h-9 w-full max-w-sm items-center justify-between rounded-lg border border-input bg-muted/40 px-3 text-xs text-muted-foreground shadow-xs transition-colors",
              "hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
            )}
            title="Search CRM (Press ⌘K or Ctrl+K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="size-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">Search chats, contacts, pages...</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Theme Toggle & User Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile search icon button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandOpen(true)}
            className="sm:hidden size-8 text-muted-foreground hover:text-foreground"
            title="Search CRM"
          >
            <Search className="size-4" />
          </Button>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <Sun className="size-4 text-amber-400" />
                  ) : (
                    <Moon className="size-4 text-slate-700" />
                  )
                ) : (
                  <Sun className="size-4 opacity-50" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Toggle theme</TooltipContent>
          </Tooltip>

          {/* Notification bell (placeholder) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-8 text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notifications (2 new)</TooltipContent>
          </Tooltip>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-1 flex items-center gap-2 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="User account menu"
              >
                <Avatar size="sm" className="ring-1 ring-border cursor-pointer">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {user?.name ?? "Guest User"}
                    </p>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {user?.role ?? "agent"}
                    </span>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email ?? "arjun@mindclub.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/settings?tab=profile"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
