"use client";

import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TriggerNodeData {
  label: string;
  description?: string;
  triggerType?: string;
}

export function TriggerNode({ data, selected }: NodeProps) {
  const nodeData = (data || {}) as unknown as TriggerNodeData;

  return (
    <div
      className={cn(
        "relative min-w-[260px] max-w-[300px] rounded-xl border bg-card p-4 shadow-sm transition-all duration-200",
        "border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-md",
        selected && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background",
      )}
    >
      {/* Header Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-emerald-500 to-teal-400" />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="size-4 fill-emerald-500/20" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Trigger
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
          <Radio className="size-2.5 animate-pulse text-emerald-500" />
          <span>Active</span>
        </div>
      </div>

      {/* Node Body */}
      <div>
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {nodeData.label || "New Message Received"}
        </h4>
        {nodeData.description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {nodeData.description}
          </p>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-3 !border-2 !border-background !bg-emerald-500 hover:!scale-125 transition-transform"
      />
    </div>
  );
}
