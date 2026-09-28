"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // TODO: Integrate Sentry — Sentry.captureException(error)
    logger.error("[Global App] error", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full border-border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xs">
            <AlertOctagon className="size-8 stroke-[1.75]" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            A critical application error occurred. We have logged the issue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-muted/60 border border-border p-3.5 text-xs text-foreground/80 font-mono break-words leading-relaxed">
            {error.message || "An unexpected application error was encountered."}
          </div>
          {error.digest && (
            <p className="mt-2 text-[10px] text-muted-foreground text-center font-mono">
              Error Digest: {error.digest}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Button variant="outline" onClick={() => reset()} className="w-full sm:w-auto gap-2">
            <RotateCcw className="size-4" />
            Try Again
          </Button>

          <Button
            asChild
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
          >
            <Link href="/dashboard">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
