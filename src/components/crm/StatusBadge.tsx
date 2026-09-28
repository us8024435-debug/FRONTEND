"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StatusVariant =
  "conversation" | "template" | "campaign" | "agent" | "contact" | "workflow";

export interface StatusBadgeProps {
  status: string;
  variant: StatusVariant;
  className?: string;
}

type ColorScheme = "green" | "yellow" | "gray" | "red" | "orange" | "blue";

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().trim();

  // Resolve color scheme by variant + status
  const color: ColorScheme = React.useMemo(() => {
    switch (variant) {
      case "conversation":
        if (normalized === "open") return "green";
        if (normalized === "pending") return "yellow";
        if (normalized === "resolved") return "gray";
        if (normalized === "expired") return "red";
        return "gray";

      case "template":
        if (normalized === "approved") return "green";
        if (normalized === "pending") return "yellow";
        if (normalized === "rejected") return "red";
        if (normalized === "draft") return "gray";
        if (normalized === "paused") return "orange";
        return "gray";

      case "campaign":
        if (normalized === "sent") return "green";
        if (normalized === "scheduled") return "blue";
        if (normalized === "draft") return "gray";
        if (normalized === "sending") return "yellow";
        if (normalized === "paused") return "orange";
        if (normalized === "failed") return "red";
        return "gray";

      case "agent":
        if (normalized === "online") return "green";
        if (normalized === "away") return "yellow";
        if (normalized === "offline") return "gray";
        return "gray";

      case "contact":
        if (normalized === "active") return "green";
        if (normalized === "inactive") return "gray";
        if (normalized === "blocked") return "red";
        return "gray";

      case "workflow":
        if (normalized === "active") return "green";
        if (normalized === "draft") return "gray";
        if (normalized === "paused") return "yellow";
        if (normalized === "inactive") return "gray";
        return "gray";

      default:
        return "gray";
    }
  }, [variant, normalized]);

  const styleMap: Record<ColorScheme, { badge: string; dot: string }> = {
    green: {
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-500",
    },
    yellow: {
      badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
      dot: "bg-amber-500",
    },
    gray: {
      badge: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/25",
      dot: "bg-zinc-400",
    },
    red: {
      badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25",
      dot: "bg-red-500",
    },
    orange: {
      badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25",
      dot: "bg-orange-500",
    },
    blue: {
      badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
      dot: "bg-blue-500",
    },
  };

  const currentStyles = styleMap[color];
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full shadow-2xs",
        currentStyles.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", currentStyles.dot)} />
      <span>{label}</span>
    </Badge>
  );
}
