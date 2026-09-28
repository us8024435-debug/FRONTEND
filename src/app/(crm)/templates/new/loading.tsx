import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function NewTemplateLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* PageHeader Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Two-column builder skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-2xs">
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Phone Preview (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[320px] rounded-[36px] border-4 border-muted p-3 bg-card shadow-lg space-y-3">
            <div className="h-4 w-24 mx-auto rounded-full bg-muted" />
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-48 w-4/5 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
