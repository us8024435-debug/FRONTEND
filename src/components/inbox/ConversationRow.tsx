"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Conversation, MessageContent } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ConversationRowProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function getMessageSnippet(content?: MessageContent): string {
  if (!content) return "No messages yet";
  return (
    content.text ||
    content.caption ||
    content.fileName ||
    (content.mediaUrl ? "Media attachment" : "Message")
  );
}

export function ConversationRow({ conversation, isActive, onClick }: ConversationRowProps) {
  const { contact, lastMessage, unreadCount, status, priority, updatedAt } = conversation;

  const getInitials = (name?: string) => {
    if (!name) return "WA";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Status dot indicator color
  const statusColor =
    {
      open: "bg-emerald-500 ring-2 ring-background",
      pending: "bg-amber-500 ring-2 ring-background",
      resolved: "bg-zinc-400 ring-2 ring-background",
      expired: "bg-red-500 ring-2 ring-background",
    }[status] ?? "bg-zinc-400 ring-2 ring-background";

  return (
    <motion.div
      layout
      layoutId={conversation.id}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-colors border-b border-border/50 select-none",
        isActive
          ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-l-3 border-l-emerald-500"
          : "hover:bg-muted/50",
      )}
    >
      {/* Contact Avatar with Status Indicator Dot */}
      <div className="relative shrink-0">
        <Avatar size="default" className="ring-1 ring-border">
          <AvatarImage src={contact.avatarUrl} alt={contact.name} />
          <AvatarFallback className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn("absolute bottom-0 right-0 size-2.5 rounded-full", statusColor)}
          title={`Status: ${status}`}
        />
      </div>

      {/* Contact Info & Message Preview */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn(
                "text-xs font-semibold truncate",
                isActive ? "text-emerald-700 dark:text-emerald-400" : "text-foreground",
              )}
            >
              {contact.name}
            </span>

            {/* High priority indicator */}
            {priority === "high" && (
              <span className="size-1.5 rounded-full bg-red-500 shrink-0" title="High Priority" />
            )}
          </div>

          {/* Relative Timestamp */}
          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
            {formatRelativeTime(updatedAt)}
          </span>
        </div>

        {/* Message snippet preview */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs truncate max-w-[210px]",
              unreadCount > 0
                ? "font-medium text-foreground"
                : "text-muted-foreground group-hover:text-foreground/80 transition-colors",
            )}
          >
            {getMessageSnippet(lastMessage?.content)}
          </p>

          {/* Unread Message Count Badge */}
          {unreadCount > 0 && (
            <span className="flex size-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 shrink-0 shadow-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
