import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ContactDetailLoading() {
  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Top Header Card Skeleton */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* 80px Avatar */}
              <Skeleton className="size-20 rounded-full shrink-0" />

              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-6 w-36 rounded-md" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout below (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60% = col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details Card Skeleton */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>

              {/* Custom Attributes Skeleton */}
              <div className="pt-4 border-t border-border/40 space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversations Card Skeleton */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (40% = col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tags Section Skeleton */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Notes Section Skeleton */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Activity Timeline Skeleton */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
