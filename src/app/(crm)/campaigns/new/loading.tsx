import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function NewCampaignLoading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] select-none">
      {/* Top Stepper Skeleton */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="hidden sm:block space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2 w-12" />
                </div>
                {i < 3 && <Skeleton className="hidden sm:block h-0.5 w-12 sm:w-20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Step Content Skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <Card className="border-border shadow-2xs">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3.5 w-72" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar Skeleton */}
      <div className="border-t bg-card/80 backdrop-blur-sm sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-6">
          <Skeleton className="h-8 w-20 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
