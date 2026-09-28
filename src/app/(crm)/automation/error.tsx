"use client";

import * as React from "react";
import { AlertCircle, RotateCcw, GitBranch } from "lucide-react";
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

export default function AutomationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // TODO: Integrate Sentry — Sentry.captureException(error)
    logger.error("[Automation] error", error);
  }, [error]);

  return (
    <div className="flex min-h-[600px] w-full items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            Automation engine error
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            A rendering or state error occurred in the automation workflow engine.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="rounded-lg bg-destructive/5 border border-destructive/15 p-3 text-xs text-destructive font-mono break-words leading-relaxed">
            {error.message || "An unexpected error occurred while rendering the React Flow canvas."}
          </div>

          {error.digest && (
            <p className="text-[10px] text-muted-foreground text-center font-mono">
              Digest: {error.digest}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Retry Automation</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => (window.location.href = "/automation")}
            className="text-xs gap-1.5"
          >
            <GitBranch className="size-3.5" />
            <span>Back to Automations</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
