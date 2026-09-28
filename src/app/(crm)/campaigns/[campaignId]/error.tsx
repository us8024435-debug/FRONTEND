"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
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

export default function CampaignDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // TODO: Integrate Sentry — Sentry.captureException(error)
    logger.error("[Campaign Detail] error", error);
  }, [error]);

  return (
    <div className="flex min-h-[600px] w-full items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">Campaign Error</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            An unexpected error occurred while loading campaign details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-destructive/5 border border-destructive/15 p-3 text-xs text-destructive font-mono break-words leading-relaxed">
            {error.message || "Failed to load campaign data."}
          </div>
          {error.digest && (
            <p className="mt-2 text-[10px] text-muted-foreground text-center font-mono">
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
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
