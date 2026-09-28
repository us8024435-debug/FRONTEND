"use client";

import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap, MessageSquare, UserCheck, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionNodeData {
  label: string;
  description?: string;
  actionType?: "template" | "agent" | "tag" | "default";
}

export function ActionNode({ data, selected }: NodeProps) {
  const nodeData = (data || {}) as unknown as ActionNodeData;

  const Icon = React.useMemo(() => {
    switch (nodeData.actionType) {
      case "template":
        return MessageSquare;
      case "agent":
        return UserCheck;
      default:
        return Zap;
    }
  }, [nodeData.actionType]);

  return (
    <div
      className={cn(
        "relative min-w-[260px] max-w-[300px] rounded-xl border bg-card p-4 shadow-sm transition-all duration-200",
        "border-blue-500/30 hover:border-blue-500/60 hover:shadow-md",
        selected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-background",
      )}
    >
      {/* Header Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-blue-500 to-indigo-500" />

      {/* Input Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!size-3 !border-2 !border-background !bg-blue-500 hover:!scale-125 transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Icon className="size-4" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Action
          </span>
        </div>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Step
        </span>
      </div>

      {/* Node Body */}
      <div>
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {nodeData.label || "Execute Action"}
        </h4>
        {nodeData.description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {nodeData.description}
          </p>
        )}
      </div>

      {/* Output Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-3 !border-2 !border-background !bg-blue-500 hover:!scale-125 transition-transform"
      />
    </div>
  );
}
