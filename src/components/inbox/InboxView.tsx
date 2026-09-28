"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { queryKeys, fetchConversation } from "@/lib/api";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { useUIStore } from "@/lib/stores/uiStore";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { CustomerSidebar } from "./CustomerSidebar";

export interface InboxViewProps {
  initialConversationId?: string;
}

export function InboxView({ initialConversationId }: InboxViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { activeConversationId, setActiveConversation } = useConversationStore();
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  // 1. Set active module in UI store on mount
  React.useEffect(() => {
    setActiveModule("inbox");
  }, [setActiveModule]);

  // 2. Restore active conversation from props or URL searchParams (?id=...)
  const idFromParams = searchParams.get("id");
  React.useEffect(() => {
    const targetId = initialConversationId || idFromParams;
    if (targetId) {
      setActiveConversation(targetId);
    }
  }, [initialConversationId, idFromParams, setActiveConversation]);

  // 3. Fetch conversation metadata for active conversation
  const { data: convData } = useQuery({
    queryKey: queryKeys.conversations.detail(activeConversationId || ""),
    queryFn: () => fetchConversation(activeConversationId!),
    enabled: Boolean(activeConversationId),
  });

  const activeConversation = convData?.data;

  // 4. Handle conversation selection & URL update without full navigation
  const handleSelectConversation = React.useCallback(
    (id: string) => {
      setActiveConversation(id);
      router.push(`/inbox?id=${id}`, { scroll: false });
    },
    [router, setActiveConversation],
  );

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-background select-none">
      {/* 1. Left Panel: Conversation List (350px fixed) */}
      <ConversationList onSelectConversation={handleSelectConversation} />

      {/* 2. Center Panel: Chat Window (flex-1) or Empty State */}
      <section className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        {activeConversationId ? (
          <ChatWindow conversationId={activeConversationId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 bg-[#efeae2]/30 dark:bg-[#0b141a]/40 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px]">
            <EmptyState
              icon={MessageSquare}
              title="Select a conversation"
              description="Choose a conversation from the list"
              className="border-none bg-transparent shadow-none"
            />
          </div>
        )}
      </section>

      {/* 3. Right Panel: Customer Sidebar (320px, slide-in) */}
      {activeConversation && (
        <CustomerSidebar
          contactId={activeConversation.contactId}
          conversationId={activeConversation.id}
        />
      )}
    </div>
  );
}
