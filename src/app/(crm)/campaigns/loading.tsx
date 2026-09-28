import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* PageHeader Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Filter Row Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Skeleton className="h-9 w-72 rounded-md" />
        <Skeleton className="h-9 w-64 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
        {/* Header */}
        <div className="h-11 bg-muted/40 border-b border-border flex items-center px-4 gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 px-4 flex items-center gap-6">
              <div className="space-y-1 w-44">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="size-8 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
