"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { motionConfig, useReducedMotion } from "@/lib/motion";
import type { Template, TemplateQualityScore } from "@/lib/types";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TemplatePreview } from "@/components/crm/TemplatePreview";

export interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

const categoryColors: Record<string, { badge: string }> = {
  marketing: {
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
  },
  utility: {
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
  },
  authentication: {
    badge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
  },
};

const qualityDotColor: Record<TemplateQualityScore, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  unknown: "bg-zinc-400",
};

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const animatedPreset = useReducedMotion(motionConfig.scaleIn);

  const categoryLabel = template.category.charAt(0).toUpperCase() + template.category.slice(1);
  const categoryStyle = categoryColors[template.category] ??
    categoryColors.utility ?? { badge: "" };

  const bodyPreview = React.useMemo(() => {
    const text = template.body.text || "";
    return text.length > 100 ? text.slice(0, 100) + "..." : text;
  }, [template.body.text]);

  return (
    <HoverCard openDelay={350} closeDelay={150}>
      <HoverCardTrigger asChild>
        <motion.div
          {...animatedPreset}
          onClick={onClick}
          className={cn(
            "group relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-2xs cursor-pointer",
            "transition-all duration-200 ease-out",
            "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
          )}
        >
          {/* Quality score indicator (top-right) */}
          {template.qualityScore && (
            <span
              className={cn(
                "absolute top-3.5 right-3.5 size-2 rounded-full ring-2 ring-card",
                qualityDotColor[template.qualityScore],
              )}
              title={`Quality: ${template.qualityScore}`}
            />
          )}

          {/* Header: Title + badges */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground truncate pr-5 group-hover:text-primary transition-colors">
              {template.displayName}
            </h3>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Category Badge */}
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-2 py-0 font-medium rounded-full shadow-none",
                  categoryStyle.badge,
                )}
              >
                {categoryLabel}
              </Badge>

              {/* Language Badge */}
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0 font-medium rounded-full shadow-none bg-muted/40 text-muted-foreground border-border"
              >
                {template.language.toUpperCase()}
              </Badge>

              {/* Status Badge */}
              <StatusBadge status={template.status} variant="template" />
            </div>
          </div>

          {/* Body Preview */}
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {bodyPreview || "No body text"}
          </p>

          {/* Footer: Usage + Last Used */}
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="size-3 text-emerald-500/70" />
              <span className="font-medium">{template.usageCount.toLocaleString()} sent</span>
            </div>

            {template.lastUsedAt && (
              <div className="flex items-center gap-1">
                <Clock className="size-3 opacity-50" />
                <span>{formatRelativeTime(template.lastUsedAt)}</span>
              </div>
            )}
          </div>
        </motion.div>
      </HoverCardTrigger>

      <HoverCardContent
        side="right"
        align="start"
        className="w-[320px] p-0 border-none bg-transparent shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5 p-1.5 bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-2xl">
          <div className="px-2.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Template Preview</span>
            <span className="font-mono">{template.language}</span>
          </div>
          <TemplatePreview
            header={template.header}
            body={template.body}
            footer={template.footer}
            buttons={template.buttons}
            className="w-full text-xs shadow-none border-border/50"
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
