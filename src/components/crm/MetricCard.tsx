"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: "up" | "down";
  icon: LucideIcon;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  loading = false,
  prefix = "",
  suffix = "",
  className,
}: MetricCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    if (loading || shouldReduceMotion) return;

    const controls = animate(0, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        setAnimatedValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, loading, shouldReduceMotion]);

  const displayValue = shouldReduceMotion ? value : animatedValue;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border bg-card/60 backdrop-blur-xs transition-all duration-200 hover:shadow-md hover:border-border/80",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Icon className="size-4" />
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 pt-0">
        {loading ? (
          <div className="space-y-2 py-1">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {prefix}
              {displayValue.toLocaleString()}
              {suffix}
            </div>

            {change !== undefined && changeType && (
              <div className="flex items-center gap-1 text-xs">
                {changeType === "up" ? (
                  <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="mr-0.5 size-3.5" />+{Math.abs(change)}%
                  </span>
                ) : (
                  <span className="flex items-center font-medium text-red-600 dark:text-red-400">
                    <ArrowDownRight className="mr-0.5 size-3.5" />-{Math.abs(change)}%
                  </span>
                )}
                <span className="text-muted-foreground text-[11px]">vs previous period</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
