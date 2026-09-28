"use client";

import * as React from "react";
import { WifiOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logger } from "@/lib/logger";

export default function InboxError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // TODO: Integrate Sentry — Sentry.captureException(error)
    logger.error("[Inbox] error", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-56px)] w-full items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <WifiOff className="size-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">Connection Lost</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            We lost the connection to WhatsApp. This usually resolves in a few moments.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="rounded-lg bg-destructive/5 border border-destructive/15 p-3 text-xs text-destructive font-mono break-words leading-relaxed">
            {error.message || "Failed to connect to WhatsApp conversation service."}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            The page will attempt to reconnect automatically. If the issue persists, try again
            manually.
          </p>

          {error.digest && (
            <p className="text-[10px] text-muted-foreground text-center font-mono">
              Error Digest: {error.digest}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-2"
          >
            <RotateCcw className="size-4" />
            Reconnect
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
