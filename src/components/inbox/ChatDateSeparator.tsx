import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChatDateSeparatorProps {
  date: string;
  className?: string;
}

export function ChatDateSeparator({ date, className }: ChatDateSeparatorProps) {
  return (
    <div className={cn("flex items-center justify-center my-3 select-none", className)}>
      <span className="rounded-full bg-muted/80 backdrop-blur-xs border border-border/40 px-3 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-2xs">
        {date}
      </span>
    </div>
  );
}
