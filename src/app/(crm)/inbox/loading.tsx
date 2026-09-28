import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InboxLoading() {
  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-background select-none">
      {/* 1. Left Panel Skeleton: Conversation List (350px) */}
      <aside className="w-[350px] shrink-0 border-r border-border bg-card/30 flex flex-col p-3 space-y-3">
        {/* Header & Search */}
        <div className="flex items-center justify-between pb-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />

        {/* 8 Conversation Row Skeletons */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Center Panel Skeleton: Chat History & Composer */}
      <section className="flex flex-1 flex-col h-full min-w-0 bg-[#efeae2]/15 dark:bg-[#0b141a]/20">
        {/* Header Bar */}
        <div className="h-14 px-4 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>

        {/* 6 Alternating Message Bubble Skeletons */}
        <div className="flex-1 p-6 flex flex-col justify-end space-y-4">
          <Skeleton className="h-12 w-64 rounded-2xl rounded-tl-xs self-start" />
          <Skeleton className="h-14 w-80 rounded-2xl rounded-tr-xs self-end" />
          <Skeleton className="h-10 w-44 rounded-2xl rounded-tl-xs self-start" />
          <Skeleton className="h-16 w-72 rounded-2xl rounded-tr-xs self-end" />
          <Skeleton className="h-10 w-52 rounded-2xl rounded-tl-xs self-start" />
          <Skeleton className="h-12 w-60 rounded-2xl rounded-tr-xs self-end" />
        </div>

        {/* Bottom Composer Bar */}
        <div className="p-3 border-t border-border bg-card/70 flex items-center gap-2">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <Skeleton className="size-9 rounded-full shrink-0" />
          <Skeleton className="h-10 flex-1 rounded-2xl" />
          <Skeleton className="size-9 rounded-full shrink-0" />
        </div>
      </section>

      {/* 3. Right Panel Skeleton: Customer Profile (320px) */}
      <aside className="w-[320px] shrink-0 border-l border-border bg-card/30 hidden lg:flex flex-col p-4 space-y-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="size-6 rounded-md" />
        </div>

        <div className="flex flex-col items-center space-y-2 py-2">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </aside>
    </div>
  );
}
