"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, fetchConversations } from "@/lib/api";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { Conversation } from "@/lib/types";

/**
 * Custom hook wrapping useQuery for conversation list.
 * Automatically synchronizes and refetches when inboxFilters change in Zustand store.
 */
export function useConversations() {
  const filters = useConversationStore((state) => state.inboxFilters);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.conversations.list(filters),
    queryFn: () => fetchConversations(filters),
  });

  const conversations: Conversation[] = data?.data ?? [];

  return {
    conversations,
    isLoading,
    isError,
    error,
    refetch,
    total: data?.pagination?.total ?? conversations.length,
  };
}
