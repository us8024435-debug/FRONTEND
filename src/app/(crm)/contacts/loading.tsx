import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* PageHeader Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Filter Row Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Skeleton className="h-9 w-72 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
        {/* Header */}
        <div className="h-11 bg-muted/40 border-b border-border flex items-center px-4 gap-4">
          <Skeleton className="size-4 rounded-xs" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/60">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 px-4 flex items-center gap-4">
              <Skeleton className="size-4 rounded-xs" />
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <div className="flex gap-1.5 w-32">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <div className="flex items-center gap-2 w-32">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="size-8 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>
    </div>
  );
}
