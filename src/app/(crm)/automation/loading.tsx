import { Skeleton } from "@/components/ui/skeleton";

export default function AutomationLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats Summary Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>

      {/* Large Skeleton Rectangle for Canvas / Workflows */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[210px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
