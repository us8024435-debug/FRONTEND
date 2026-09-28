"use client";

import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EndNodeData {
  label: string;
  description?: string;
}

export function EndNode({ data, selected }: NodeProps) {
  const nodeData = (data || {}) as unknown as EndNodeData;

  return (
    <div
      className={cn(
        "relative min-w-[200px] max-w-[240px] rounded-xl border bg-card p-3.5 shadow-sm transition-all duration-200",
        "border-slate-400/40 dark:border-slate-700 hover:border-slate-500 hover:shadow-md",
        selected && "ring-2 ring-slate-400 ring-offset-2 ring-offset-background",
      )}
    >
      {/* Header Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-slate-400 dark:bg-slate-600" />

      {/* Input Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!size-3 !border-2 !border-background !bg-slate-400 dark:!bg-slate-500 hover:!scale-125 transition-transform"
      />

      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="size-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Termination
          </span>
          <h4 className="text-sm font-semibold text-foreground leading-snug">
            {nodeData.label || "End"}
          </h4>
        </div>
      </div>
      {nodeData.description && (
        <p className="mt-1 text-[11px] text-muted-foreground">{nodeData.description}</p>
      )}
    </div>
  );
}
