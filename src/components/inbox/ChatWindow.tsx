"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronDown, Phone, PanelRight, MessageSquare, Sparkles } from "lucide-react";
import { queryKeys, fetchConversation, fetchMessages } from "@/lib/api";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { formatPhone, cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { motion } from "framer-motion";
import { motionConfig } from "@/lib/motion";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatDateSeparator } from "./ChatDateSeparator";
import { MessageComposer } from "./MessageComposer";

export interface ChatWindowProps {
  conversationId: string;
}

function getDateLabel(timestamp: string): string {
  const d = dayjs(timestamp);
  const now = dayjs();
  if (d.isSame(now, "day")) return "Today";
  if (d.isSame(now.subtract(1, "day"), "day")) return "Yesterday";
  if (d.isSame(now, "year")) return d.format("MMMM D");
  return d.format("MMMM D, YYYY");
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { customerSidebarOpen, toggleCustomerSidebar } = useConversationStore();

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  // Fetch conversation metadata
  const { data: convData, isLoading: convLoading } = useQuery({
    queryKey: queryKeys.conversations.detail(conversationId),
    queryFn: () => fetchConversation(conversationId),
    enabled: Boolean(conversationId),
  });

  // Fetch timeline messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: () => fetchMessages(conversationId),
    enabled: Boolean(conversationId),
  });

  const conversation = convData?.data;

  // Messages in chronological order (oldest -> newest)
  const chronologicalMessages: Message[] = React.useMemo(() => {
    const list = messagesData?.data ? [...messagesData.data] : [];
    return list.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }, [messagesData]);

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: Array<{ date: string; messages: Message[] }> = [];
    const map = new Map<string, Message[]>();

    for (const msg of chronologicalMessages) {
      const label = getDateLabel(msg.timestamp);
      if (!map.has(label)) {
        map.set(label, []);
        groups.push({ date: label, messages: map.get(label)! });
      }
      map.get(label)!.push(msg);
    }

    return groups;
  }, [chronologicalMessages]);

  const scrollToBottom = React.useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Auto-scroll on conversation switch
  React.useEffect(() => {
    scrollToBottom(false);
  }, [conversationId, scrollToBottom]);

  // Auto-scroll on new messages if not scrolled up
  React.useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom(true);
    }
  }, [chronologicalMessages.length, showScrollBottom, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 160;
    setShowScrollBottom(isUp);
  };

  const getInitials = (name?: string) => {
    if (!name) return "WA";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 bg-background overflow-hidden relative">
      {/* 1. Header Bar */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-card/70 backdrop-blur-xs z-20 shrink-0">
        {convLoading || !conversation ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar size="default" className="ring-1 ring-border">
                <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} />
                <AvatarFallback className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {getInitials(conversation.contact.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground truncate">
                  {conversation.contact.name}
                </h3>
                <StatusBadge status={conversation.status} variant="conversation" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Phone className="size-3 shrink-0" />
                <span>{formatPhone(conversation.contact.phone)}</span>
                {conversation.contact.tags?.[0] && (
                  <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-foreground">
                    {conversation.contact.tags[0].name}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Right header actions */}
        <div className="flex items-center gap-1.5">
          {/* Demo toggle for simulated contact typing */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTyping(!isTyping)}
            className={cn(
              "hidden sm:flex h-8 gap-1 text-xs text-muted-foreground hover:text-foreground",
              isTyping && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            )}
            title="Simulate incoming customer typing"
          >
            <Sparkles className="size-3.5" />
            <span>{isTyping ? "Typing active" : "Test typing"}</span>
          </Button>

          {/* Toggle Customer Info sidebar */}
          <Button
            variant={customerSidebarOpen ? "secondary" : "ghost"}
            size="icon"
            onClick={toggleCustomerSidebar}
            className="size-8"
            title="Toggle Customer Information Panel"
            aria-label="Toggle Customer Information Panel"
          >
            <PanelRight className="size-4" />
          </Button>
        </div>
      </header>

      {/* 2. Message History Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={cn(
          "flex-1 overflow-y-auto chat-scrollbar p-4 space-y-3 relative flex flex-col",
          // Subtle WhatsApp pattern background
          "bg-[#efeae2]/30 dark:bg-[#0b141a]/40 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px]",
        )}
      >
        {messagesLoading ? (
          <div className="flex-1 flex flex-col justify-end space-y-4 py-4">
            <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-xs self-start" />
            <Skeleton className="h-12 w-64 rounded-2xl rounded-tr-xs self-end" />
            <Skeleton className="h-10 w-40 rounded-2xl rounded-tl-xs self-start" />
            <Skeleton className="h-14 w-72 rounded-2xl rounded-tr-xs self-end" />
            <Skeleton className="h-8 w-36 rounded-2xl rounded-tl-xs self-start" />
            <Skeleton className="h-12 w-60 rounded-2xl rounded-tr-xs self-end" />
          </div>
        ) : chronologicalMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 select-none">
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Send the first message"
              className="border-none bg-transparent shadow-none"
            />
          </div>
        ) : (
          <motion.div {...motionConfig.fadeIn} className="flex flex-col flex-1 justify-end">
            {groupedMessages.map((group) => (
              <React.Fragment key={group.date}>
                <ChatDateSeparator date={group.date} />
                {group.messages.map((message, idx) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isLast={idx === group.messages.length - 1}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator senderName={conversation?.contact.name} />}

            <div ref={messagesEndRef} className="h-1" />
          </motion.div>
        )}
      </div>

      {/* Floating Scroll to Bottom FAB */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute right-6 bottom-20 z-20 flex size-9 items-center justify-center rounded-full bg-card border border-border shadow-lg text-foreground hover:bg-muted transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          title="Scroll to bottom"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="size-4" />
        </button>
      )}

      {/* 3. Message Composer Bar */}
      <MessageComposer conversationId={conversationId} onSendMessage={() => scrollToBottom(true)} />
    </div>
  );
}
