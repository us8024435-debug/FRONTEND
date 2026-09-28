import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CampaignDetailLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Back button & status skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Header Card Skeleton */}
      <Card className="border-border shadow-2xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-3.5 w-32" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-8 w-36 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="size-10 rounded-xl shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (60%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Funnel Chart Skeleton */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="pb-3 space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[260px] w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Recipient Table Skeleton */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-48" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </CardHeader>
            <CardContent className="p-0 border-t border-border">
              <div className="divide-y divide-border/60">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-3 flex items-center gap-3">
                    <Skeleton className="size-7 rounded-full" />
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3.5 w-32 ml-auto" />
                    <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Timeline Skeleton */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="pb-3 space-y-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-48" />
            </CardHeader>
            <CardContent className="space-y-6 pl-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Template Skeleton */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="flex justify-center p-4">
              <Skeleton className="h-[280px] w-full rounded-2xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
