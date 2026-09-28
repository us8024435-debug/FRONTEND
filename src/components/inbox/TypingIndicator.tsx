import * as React from "react";
import { cn } from "@/lib/utils";

export interface TypingIndicatorProps {
  className?: string;
  senderName?: string;
}

export function TypingIndicator({ className, senderName }: TypingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2 self-start my-1", className)}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-bl-xs bubble-inbound border border-border/40 shadow-2xs">
        <span className="typing-dot bg-muted-foreground/70" />
        <span className="typing-dot bg-muted-foreground/70" />
        <span className="typing-dot bg-muted-foreground/70" />
      </div>
      <span className="sr-only">
        {senderName ? `${senderName} is typing...` : "Contact is typing..."}
      </span>
    </div>
  );
}
