"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionConfig, useReducedMotion } from "@/lib/motion";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const animatedPreset = useReducedMotion(motionConfig.fadeIn);

  return (
    <motion.div
      {...animatedPreset}
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-8 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-8 ring-muted/20">
        <Icon className="size-8 stroke-[1.5]" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>

      <p className="mt-1.5 max-w-sm text-xs md:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
