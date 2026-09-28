import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in-50 duration-200">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44 rounded-md" />
          <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>

      {/* 2. KPI Cards Grid (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-3.5 w-36 rounded" />
          </div>
        ))}
      </div>

      {/* 3. Primary Charts: 2 large cards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-5 shadow-xs space-y-4"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3.5 w-64 rounded" />
            </div>
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* 4. Secondary Row: Campaign Donut & Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3.5 w-52 rounded" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-[240px] w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* 5. Tertiary Row: Agent Leaderboard & Top Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-5 shadow-xs space-y-4"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3.5 w-60 rounded" />
            </div>
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
