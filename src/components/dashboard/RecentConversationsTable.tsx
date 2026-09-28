"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { queryKeys, fetchConversations } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { MessageContent } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

function getMessageSnippet(content?: MessageContent): string {
  if (!content) return "No messages yet";
  return (
    content.text ||
    content.caption ||
    content.fileName ||
    (content.mediaUrl ? "Media message" : "Message")
  );
}

export function RecentConversationsTable() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.conversations.list({}),
    queryFn: () => fetchConversations({}),
  });

  const conversations = data?.data?.slice(0, 5) ?? [];

  const getInitials = (name?: string) => {
    if (!name) return "WA";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recent Conversations</CardTitle>
          <CardDescription className="text-xs">
            Latest incoming chats and agent responses
          </CardDescription>
        </div>
        <Link
          href="/inbox"
          className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View All <ArrowRight className="ml-1 size-3" />
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No active conversations found.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => router.push(`/inbox?conversationId=${conv.id}`)}
                className="flex items-center justify-between py-2.5 px-1.5 -mx-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Avatar size="default" className="shrink-0 ring-1 ring-border">
                    <AvatarImage src={conv.contact.avatarUrl} alt={conv.contact.name} />
                    <AvatarFallback className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {getInitials(conv.contact.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {conv.contact.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                      {getMessageSnippet(conv.lastMessage?.content)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={conv.status} variant="conversation" />
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(conv.updatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
