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

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[Settings Error Boundary]:", error);
  }, [error]);

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">Settings Error</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            An unexpected error occurred while loading settings configuration.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="rounded-lg bg-destructive/5 border border-destructive/15 p-3 text-xs text-destructive font-mono break-words leading-relaxed">
            {error.message || "Failed to load settings configuration."}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <Button
            size="sm"
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
