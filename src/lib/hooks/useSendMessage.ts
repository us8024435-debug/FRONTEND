"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, sendMessage } from "@/lib/api";
import {
  Message,
  Conversation,
  SendMessageInput,
  PaginatedResponse,
  ApiResponse,
} from "@/lib/types";

export interface SendMessageVariables {
  conversationId?: string;
  data: SendMessageInput;
}

export type SendMessageParams = SendMessageVariables | SendMessageInput;

/**
 * Custom mutation hook for sending outbound messages in a conversation.
 * Handles optimistic updates to:
 * 1. queryKeys.conversations.messages(conversationId)
 * 2. queryKeys.conversations.list() (updates lastMessage preview and timestamps)
 * 3. queryKeys.conversations.detail(conversationId)
 * Rolls back on error and triggers a Sonner error toast.
 * Invalidates conversation queries on success.
 */
export function useSendMessage(defaultConversationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: SendMessageParams) => {
      const convId =
        "data" in variables && variables.conversationId
          ? variables.conversationId
          : defaultConversationId;

      if (!convId) {
        throw new Error("Conversation ID is required to send a message");
      }

      const inputData: SendMessageInput = "data" in variables ? variables.data : variables;

      return sendMessage(convId, inputData);
    },

    onMutate: async (variables: SendMessageParams) => {
      const convId =
        "data" in variables && variables.conversationId
          ? variables.conversationId
          : defaultConversationId;

      if (!convId) return;

      const inputData: SendMessageInput = "data" in variables ? variables.data : variables;

      // 1. Cancel any active queries so they don't overwrite optimistic data
      await queryClient.cancelQueries({
        queryKey: queryKeys.conversations.detail(convId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.conversations.lists(),
      });

      // 2. Snapshot current state for rollback
      const previousMessages = queryClient.getQueryData<PaginatedResponse<Message>>(
        queryKeys.conversations.messages(convId),
      );

      const previousConversations = queryClient.getQueriesData<PaginatedResponse<Conversation>>({
        queryKey: queryKeys.conversations.lists(),
      });

      const previousDetail = queryClient.getQueryData<ApiResponse<Conversation>>(
        queryKeys.conversations.detail(convId),
      );

      // 3. Construct optimistic outbound message
      const now = new Date().toISOString();
      const optimisticMessage: Message = {
        id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        conversationId: convId,
        direction: "outbound",
        type: inputData.type,
        content: inputData.content,
        status: "sending",
        senderType: "agent",
        timestamp: now,
      };

      // 4. Optimistically append message to conversation messages cache
      queryClient.setQueryData<PaginatedResponse<Message>>(
        queryKeys.conversations.messages(convId),
        (old) => {
          if (!old) {
            return {
              data: [optimisticMessage],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 1,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
              },
            };
          }
          return {
            ...old,
            data: [...old.data, optimisticMessage],
            pagination: {
              ...old.pagination,
              total: old.pagination.total + 1,
            },
          };
        },
      );

      // 5. Optimistically update last message preview in conversations lists
      queryClient.setQueriesData<PaginatedResponse<Conversation>>(
        { queryKey: queryKeys.conversations.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((c) => {
              if (c.id === convId) {
                return {
                  ...c,
                  lastMessage: optimisticMessage,
                  updatedAt: now,
                };
              }
              return c;
            }),
          };
        },
      );

      // 6. Optimistically update conversation detail query
      queryClient.setQueryData<ApiResponse<Conversation>>(
        queryKeys.conversations.detail(convId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              lastMessage: optimisticMessage,
              updatedAt: now,
            },
          };
        },
      );

      return {
        convId,
        previousMessages,
        previousConversations,
        previousDetail,
        optimisticMessageId: optimisticMessage.id,
      };
    },

    onError: (err, _variables, context) => {
      if (context?.convId) {
        if (context.previousMessages) {
          queryClient.setQueryData(
            queryKeys.conversations.messages(context.convId),
            context.previousMessages,
          );
        }
        if (context.previousConversations) {
          context.previousConversations.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
        if (context.previousDetail) {
          queryClient.setQueryData(
            queryKeys.conversations.detail(context.convId),
            context.previousDetail,
          );
        }
      }
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    },

    onSuccess: (response, variables, context) => {
      const convId =
        "data" in variables && variables.conversationId
          ? variables.conversationId
          : defaultConversationId;

      const serverMessage = response.data;

      // Replace optimistic placeholder with confirmed server message
      if (convId && context?.optimisticMessageId) {
        queryClient.setQueryData<PaginatedResponse<Message>>(
          queryKeys.conversations.messages(convId),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.map((msg) =>
                msg.id === context.optimisticMessageId ? serverMessage : msg,
              ),
            };
          },
        );
      }

      // Re-synchronize conversation queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });
}
