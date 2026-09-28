import * as React from "react";
import { MessageCircle, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="relative flex items-center justify-center mb-5">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 animate-pulse">
          <MessageCircle className="size-7 fill-slate-950 text-slate-950" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Loader2 className="size-4 animate-spin text-emerald-500" />
        <span>Loading WhatsApp CRM...</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Initializing workspace modules and live query cache
      </p>
    </div>
  );
}
