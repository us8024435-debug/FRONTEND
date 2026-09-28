"use client";

import * as React from "react";
import {
  MessageSquare,
  Tag,
  StickyNote,
  UserCheck,
  RefreshCw,
  Send,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Activity as ActivityIcon,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import { Activity, ActivityType } from "@/lib/types";
import { formatRelativeTime, cn } from "@/lib/utils";
import { motionConfig } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface ContactActivityTimelineProps {
  activities?: Activity[];
  className?: string;
  initialLimit?: number;
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "message_sent":
    case "message_received":
      return <MessageSquare className="size-3 text-emerald-600 dark:text-emerald-400" />;
    case "tag_added":
    case "tag_removed":
      return <Tag className="size-3 text-blue-600 dark:text-blue-400" />;
    case "note_added":
      return <StickyNote className="size-3 text-amber-600 dark:text-amber-400" />;
    case "assigned":
      return <UserCheck className="size-3 text-purple-600 dark:text-purple-400" />;
    case "status_changed":
      return <RefreshCw className="size-3 text-indigo-600 dark:text-indigo-400" />;
    case "campaign_sent":
      return <Send className="size-3 text-rose-600 dark:text-rose-400" />;
    case "contact_created":
    case "contact_updated":
      return <User className="size-3 text-teal-600 dark:text-teal-400" />;
    default:
      return <Clock className="size-3 text-muted-foreground" />;
  }
}

function getActivityBg(type: ActivityType) {
  switch (type) {
    case "message_sent":
    case "message_received":
      return "bg-emerald-500/10 border-emerald-500/30";
    case "tag_added":
    case "tag_removed":
      return "bg-blue-500/10 border-blue-500/30";
    case "note_added":
      return "bg-amber-500/10 border-amber-500/30";
    case "assigned":
      return "bg-purple-500/10 border-purple-500/30";
    case "status_changed":
      return "bg-indigo-500/10 border-indigo-500/30";
    case "campaign_sent":
      return "bg-rose-500/10 border-rose-500/30";
    default:
      return "bg-muted border-border";
  }
}

/**
 * Vertical timeline displaying customer history with type-specific markers and relative timestamps.
 */
export function ContactActivityTimeline({
  activities = [],
  className,
  initialLimit = 10,
}: ContactActivityTimelineProps) {
  const [expanded, setExpanded] = React.useState(false);

  const displayedActivities = React.useMemo(() => {
    if (expanded) return activities;
    return activities.slice(0, initialLimit);
  }, [activities, expanded, initialLimit]);

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No activity yet"
        description="Activity will be logged here automatically"
        className="border-none bg-transparent min-h-[140px] p-2"
      />
    );
  }

  const hasMore = activities.length > initialLimit;

  return (
    <motion.div {...motionConfig.fadeIn} className={cn("space-y-4", className)}>
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border/80">
        {displayedActivities.map((act) => (
          <div key={act.id} className="relative group text-xs">
            {/* Timeline Circle Marker */}
            <div
              className={cn(
                "absolute -left-6 top-0.5 size-5 rounded-full border flex items-center justify-center bg-card ring-2 ring-background transition-transform group-hover:scale-110",
                getActivityBg(act.type),
              )}
            >
              {getActivityIcon(act.type)}
            </div>

            {/* Timeline Content */}
            <div className="space-y-0.5">
              <p className="text-foreground leading-snug font-normal text-[12px] break-words">
                {act.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{formatRelativeTime(act.timestamp)}</span>
                {act.performedBy?.name && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-foreground/80">{act.performedBy.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expand / Collapse Button */}
      {hasMore && (
        <div className="pt-1 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 w-full"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="size-3" />
              </>
            ) : (
              <>
                <span>Show {activities.length - initialLimit} more</span>
                <ChevronDown className="size-3" />
              </>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
