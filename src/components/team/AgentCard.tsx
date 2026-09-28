"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Shield, Trash2, MessageSquare } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Agent, AgentRole, AgentStatus } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ───────────────────────────────────────────────────────
// Status & Role Config
// ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AgentStatus, { color: string; ring: string; label: string }> = {
  online: {
    color: "bg-emerald-500",
    ring: "ring-emerald-500/30",
    label: "Online",
  },
  away: {
    color: "bg-amber-400",
    ring: "ring-amber-400/30",
    label: "Away",
  },
  offline: {
    color: "bg-gray-400 dark:bg-gray-500",
    ring: "ring-gray-400/30",
    label: "Offline",
  },
};

const ROLE_CONFIG: Record<AgentRole, { bg: string; text: string; label: string }> = {
  admin: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-400",
    label: "Admin",
  },
  manager: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    label: "Manager",
  },
  agent: {
    bg: "bg-gray-100 dark:bg-gray-800/50",
    text: "text-gray-700 dark:text-gray-400",
    label: "Agent",
  },
};

// ───────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────

export interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onChangeRole?: (agent: Agent) => void;
  onRemove?: (agent: Agent) => void;
}

export function AgentCard({ agent, onEdit, onChangeRole, onRemove }: AgentCardProps) {
  const statusCfg = STATUS_CONFIG[agent.status];
  const roleCfg = ROLE_CONFIG[agent.role];
  const initials = agent.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const capacityPercent =
    agent.maxConversations > 0
      ? Math.round((agent.activeConversations / agent.maxConversations) * 100)
      : 0;

  const capacityColor =
    capacityPercent >= 90
      ? "bg-red-500"
      : capacityPercent >= 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/60">
      <CardContent className="p-5 space-y-4">
        {/* Top row: Avatar + Name + Actions */}
        <div className="flex items-start gap-3.5">
          {/* Avatar with status dot overlay */}
          <div className="relative shrink-0">
            <Avatar className="size-14 border-2 border-border/50">
              <AvatarImage src={agent.avatarUrl} alt={agent.name} className="object-cover" />
              <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Status dot */}
            <span
              className={cn(
                "absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-card ring-2",
                statusCfg.color,
                statusCfg.ring,
              )}
              title={statusCfg.label}
            />
          </div>

          {/* Name + Email + Role */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate">{agent.name}</h3>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0 h-4 shrink-0",
                  roleCfg.bg,
                  roleCfg.text,
                )}
              >
                {roleCfg.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{agent.email}</p>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="text-xs gap-2" onClick={() => onEdit?.(agent)}>
                <Pencil className="size-3.5" />
                Edit Agent
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2" onClick={() => onChangeRole?.(agent)}>
                <Shield className="size-3.5" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                onClick={() => onRemove?.(agent)}
              >
                <Trash2 className="size-3.5" />
                Remove Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Capacity bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <MessageSquare className="size-3" />
              Active Conversations
            </span>
            <span className="font-bold tabular-nums">
              {agent.activeConversations}
              <span className="text-muted-foreground font-normal"> / {agent.maxConversations}</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                capacityColor,
              )}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Departments */}
        {agent.departments.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {agent.departments.map((dept) => (
              <Badge
                key={dept}
                variant="outline"
                className="text-[10px] font-medium py-0 h-5 px-2 border-border/60"
              >
                {dept}
              </Badge>
            ))}
          </div>
        )}

        {/* Last active */}
        <div className="text-[10px] text-muted-foreground">
          {agent.lastActiveAt ? (
            <>
              Last active{" "}
              <span className="font-medium text-foreground/70">
                {formatRelativeTime(agent.lastActiveAt)}
              </span>
            </>
          ) : (
            "Never active"
          )}
        </div>
      </CardContent>
    </Card>
  );
}
