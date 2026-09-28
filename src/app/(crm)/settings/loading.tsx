import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-16">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-border pb-5">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Tabs List Skeleton */}
      <Skeleton className="h-11 w-full rounded-xl" />

      {/* Card Content Skeleton */}
      <div className="space-y-4 rounded-xl border border-border/70 p-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-80" />
        </div>
        <div className="space-y-4 pt-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      </div>

      {/* Bottom Reset Card Skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
