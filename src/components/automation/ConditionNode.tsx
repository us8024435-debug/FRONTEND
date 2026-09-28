"use client";

import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConditionNodeData {
  label: string;
  description?: string;
  conditionType?: string;
}

export function ConditionNode({ data, selected }: NodeProps) {
  const nodeData = (data || {}) as unknown as ConditionNodeData;

  return (
    <div
      className={cn(
        "relative min-w-[280px] max-w-[320px] rounded-xl border bg-card p-4 shadow-sm transition-all duration-200",
        "border-amber-500/30 hover:border-amber-500/60 hover:shadow-md",
        selected && "ring-2 ring-amber-500 ring-offset-2 ring-offset-background",
      )}
    >
      {/* Header Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-amber-500 to-yellow-400" />

      {/* Input Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!size-3 !border-2 !border-background !bg-amber-500 hover:!scale-125 transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <GitBranch className="size-4" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Condition
          </span>
        </div>
        <HelpCircle className="size-3.5 text-muted-foreground/60" />
      </div>

      {/* Node Body */}
      <div>
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {nodeData.label || "Check Condition"}
        </h4>
        {nodeData.description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed font-mono bg-muted/50 rounded px-1.5 py-0.5 inline-block">
            {nodeData.description}
          </p>
        )}
      </div>

      {/* Branch Indicators and Handles */}
      <div className="mt-3.5 pt-2.5 border-t border-border/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
          <span className="inline-flex size-2 rounded-full bg-emerald-500" />
          <span>True (Yes)</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-rose-500 dark:text-rose-400">
          <span>False (No)</span>
          <span className="inline-flex size-2 rounded-full bg-rose-500" />
        </div>
      </div>

      {/* Output Handle - YES (Left) */}
      <Handle
        id="yes"
        type="source"
        position={Position.Bottom}
        style={{ left: "25%" }}
        className="!size-3 !border-2 !border-background !bg-emerald-500 hover:!scale-125 transition-transform"
      />

      {/* Output Handle - NO (Right) */}
      <Handle
        id="no"
        type="source"
        position={Position.Bottom}
        style={{ left: "75%" }}
        className="!size-3 !border-2 !border-background !bg-rose-500 hover:!scale-125 transition-transform"
      />
    </div>
  );
}
