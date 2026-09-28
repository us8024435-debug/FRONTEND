"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { logger } from "@/lib/logger";

export default function ContactDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // TODO: Integrate Sentry — Sentry.captureException(error)
    logger.error("[Contact Detail] error", error);
  }, [error]);

  return (
    <div className="container max-w-lg mx-auto p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
      <Card className="border-destructive/30 shadow-md w-full">
        <CardContent className="p-6 text-center space-y-4">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Contact not found</h2>
            <p className="text-sm text-muted-foreground">
              {error.message ||
                "The contact you are looking for could not be loaded or does not exist."}
            </p>
          </div>
          {error.digest && (
            <p className="text-[10px] text-muted-foreground font-mono">
              Error Digest: {error.digest}
            </p>
          )}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" asChild size="sm">
              <Link href="/contacts" className="gap-1.5">
                <ArrowLeft className="size-4" />
                Back to Contacts
              </Link>
            </Button>
            <Button
              onClick={() => reset()}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
