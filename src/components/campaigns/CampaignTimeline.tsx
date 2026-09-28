"use client";

import * as React from "react";
import { CheckCircle2, Clock, Send, AlertCircle, CircleDot, Check } from "lucide-react";
import { Campaign } from "@/lib/types";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface CampaignTimelineProps {
  campaign: Campaign;
}

interface TimelineStep {
  title: string;
  description: string;
  time?: string;
  status: "completed" | "current" | "upcoming" | "failed";
}

export function CampaignTimeline({ campaign }: CampaignTimelineProps) {
  const steps: TimelineStep[] = React.useMemo(() => {
    const isFailed = campaign.status === "failed";
    const isSent = campaign.status === "sent";
    const isSending = campaign.status === "sending";
    const isScheduled = campaign.status === "scheduled";
    const isDraft = campaign.status === "draft";

    const s1: TimelineStep = {
      title: "Campaign Created",
      description: "Campaign draft configured and saved",
      time: campaign.createdAt,
      status: "completed",
    };

    let s2: TimelineStep;
    if (campaign.scheduledAt) {
      s2 = {
        title: "Scheduled",
        description: `Broadcast queued for ${new Date(campaign.scheduledAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}`,
        time: campaign.scheduledAt,
        status: isDraft ? "upcoming" : "completed",
      };
    } else {
      s2 = {
        title: "Prepared for Broadcast",
        description: "Instant broadcast configuration",
        time: campaign.createdAt,
        status: isDraft ? "upcoming" : "completed",
      };
    }

    const s3: TimelineStep = {
      title: "Sending Messages",
      description: `Dispatched to ${campaign.audienceCount.toLocaleString()} contacts`,
      time: campaign.sentAt,
      status: isSent || isFailed ? "completed" : isSending ? "current" : "upcoming",
    };

    const s4: TimelineStep = isFailed
      ? {
          title: "Broadcast Failed",
          description: "Execution encountered critical errors",
          time: campaign.completedAt || campaign.updatedAt,
          status: "failed",
        }
      : {
          title: "Broadcast Completed",
          description: "All messages processed by Meta API",
          time: campaign.completedAt,
          status: isSent ? "completed" : "upcoming",
        };

    return [s1, s2, s3, s4];
  }, [campaign]);

  return (
    <Card className="border-border shadow-2xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Execution Timeline</CardTitle>
        <CardDescription className="text-xs">
          Lifecycle progression of this broadcast campaign.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isFailed = step.status === "failed";

            return (
              <div key={idx} className="relative group">
                {/* Dot / Icon */}
                <div
                  className={cn(
                    "absolute -left-6 top-0.5 size-5 rounded-full flex items-center justify-center ring-4 ring-card",
                    isCompleted && "bg-emerald-600 text-white",
                    isCurrent && "bg-blue-600 text-white animate-pulse",
                    isFailed && "bg-rose-600 text-white",
                    step.status === "upcoming" && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted && <Check className="size-3 stroke-[2.5]" />}
                  {isCurrent && <CircleDot className="size-3" />}
                  {isFailed && <AlertCircle className="size-3" />}
                  {step.status === "upcoming" && (
                    <div className="size-1.5 rounded-full bg-muted-foreground/60" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isCompleted && "text-foreground",
                        isCurrent && "text-blue-600 dark:text-blue-400 font-bold",
                        isFailed && "text-rose-600 dark:text-rose-400 font-bold",
                        step.status === "upcoming" && "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                    {step.time && (
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(step.time)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
