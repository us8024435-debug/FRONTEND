"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RotateCcw, FilterX } from "lucide-react";
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

export default function ContactsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    // TODO: Integrate Sentry — Sentry.captureException(error)
    logger.error("[Contacts] error", error);
  }, [error]);

  const handleClearFilters = () => {
    router.push("/contacts");
    reset();
  };

  return (
    <div className="flex min-h-[600px] w-full items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">Contacts Error</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            An unexpected error occurred while loading your contact directory.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="rounded-lg bg-destructive/5 border border-destructive/15 p-3 text-xs text-destructive font-mono break-words leading-relaxed">
            {error.message || "Failed to fetch contact records."}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            If the error persists, try clearing active filters or search terms.
          </p>

          {error.digest && (
            <p className="text-[10px] text-muted-foreground text-center font-mono">
              Error Digest: {error.digest}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full sm:w-auto text-xs gap-1.5"
          >
            <FilterX className="size-3.5" />
            <span>Clear Filters</span>
          </Button>

          <Button
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
