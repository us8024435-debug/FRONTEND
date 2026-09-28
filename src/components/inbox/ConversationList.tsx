"use client";

import * as React from "react";
import { MessageSquare, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { useConversations } from "@/lib/hooks/useConversations";
import { ConversationStatus } from "@/lib/types";
import { motionConfig } from "@/lib/motion";
import { SearchBar } from "@/components/shared/SearchBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationRow } from "./ConversationRow";

export interface ConversationListProps {
  onSelectConversation?: (id: string) => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps = {}) {
  const { activeConversationId, setActiveConversation, inboxFilters, setInboxFilters } =
    useConversationStore();

  const { conversations, isLoading } = useConversations();

  const handleSearchChange = React.useCallback(
    (val: string) => {
      setInboxFilters({ search: val });
    },
    [setInboxFilters],
  );

  const handleStatusChange = React.useCallback(
    (val: string) => {
      setInboxFilters({ status: val as ConversationStatus | "all" });
    },
    [setInboxFilters],
  );

  const hasActiveFilters = Boolean(
    (inboxFilters.search && inboxFilters.search.trim().length > 0) ||
    (inboxFilters.status && inboxFilters.status !== "all") ||
    (inboxFilters.assignedTo && inboxFilters.assignedTo !== "all"),
  );

  const handleClearFilters = React.useCallback(() => {
    setInboxFilters({ status: "all", search: "", assignedTo: "all" });
  }, [setInboxFilters]);

  return (
    <aside
      aria-label="Conversations inbox list"
      className="flex flex-col h-full w-[350px] shrink-0 border-r border-border bg-card/40 backdrop-blur-xs select-none"
    >
      {/* Top Search & Header */}
      <div className="p-3 space-y-2.5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            Inbox
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {conversations.length}
            </span>
          </h2>
        </div>

        {/* Debounced SearchBar */}
        <SearchBar
          value={inboxFilters.search}
          onChange={handleSearchChange}
          placeholder="Search by name or phone..."
          className="w-full max-w-none"
        />

        {/* Filter Tabs */}
        <Tabs value={inboxFilters.status} onValueChange={handleStatusChange} className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-8 bg-muted/60 p-0.5">
            <TabsTrigger value="all" className="text-xs font-medium py-1">
              All
            </TabsTrigger>
            <TabsTrigger value="open" className="text-xs font-medium py-1">
              Open
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs font-medium py-1">
              Pending
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs font-medium py-1">
              Resolved
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Conversation Rows List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 flex items-center justify-center h-full">
            {hasActiveFilters ? (
              <EmptyState
                icon={Search}
                title="No matches"
                description="Try adjusting your filters"
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
                className="border-none bg-transparent min-h-[220px] p-2"
              />
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="No conversations yet"
                description="Conversations will appear here when customers message you"
                className="border-none bg-transparent min-h-[220px] p-2"
              />
            )}
          </div>
        ) : (
          <motion.div {...motionConfig.fadeIn} className="divide-y divide-border/30">
            {conversations.map((conv) => (
              <ConversationRow
                key={conv.id}
                conversation={conv}
                isActive={activeConversationId === conv.id}
                onClick={() => {
                  setActiveConversation(conv.id);
                  onSelectConversation?.(conv.id);
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </aside>
  );
}
