import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowDetailLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] w-full overflow-hidden select-none bg-background">
      {/* Top Toolbar Skeleton */}
      <div className="h-14 border-b border-border/80 px-4 flex items-center justify-between bg-card/60 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Canvas Area Skeleton */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-muted/10">
        <div className="absolute inset-6 rounded-2xl border border-dashed border-border/40" />
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-16 w-56 rounded-xl" />
          <Skeleton className="h-10 w-1 rounded-full" />
          <Skeleton className="h-20 w-64 rounded-xl" />
          <Skeleton className="h-10 w-1 rounded-full" />
          <div className="flex gap-8">
            <Skeleton className="h-16 w-48 rounded-xl" />
            <Skeleton className="h-16 w-48 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
