import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateDetailLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      <div className="space-y-1.5 pb-5 border-b border-border">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-[480px] w-full max-w-sm mx-auto rounded-[2.2rem]" />
        </div>
      </div>
    </div>
  );
}
