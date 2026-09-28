"use client";

import * as React from "react";
import { Check, Filter, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Segment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export interface SegmentCardProps {
  segment: Segment;
  isSelected: boolean;
  onClick: () => void;
}

export function SegmentCard({ segment, isSelected, onClick }: SegmentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200",
        isSelected
          ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/5 shadow-md shadow-emerald-500/10"
          : "border-border/60 bg-card hover:border-muted-foreground/30 hover:shadow-sm",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Segment name */}
          <p className="font-semibold text-sm leading-tight truncate">{segment.name}</p>

          {/* Description */}
          {segment.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {segment.description}
            </p>
          )}

          {/* Meta badges */}
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary" className="text-[10px] gap-1 font-medium">
              <Filter className="size-2.5" />
              {segment.filters.length} {segment.filters.length === 1 ? "filter" : "filters"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] gap-1 font-bold tabular-nums bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40"
            >
              <Users className="size-2.5" />
              {segment.estimatedCount.toLocaleString()} contacts
            </Badge>
          </div>
        </div>

        {/* Selection indicator */}
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            isSelected
              ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
              : "border-muted-foreground/25 group-hover:border-muted-foreground/40",
          )}
        >
          {isSelected && <Check className="size-3.5 stroke-[3]" />}
        </div>
      </div>
    </button>
  );
}
