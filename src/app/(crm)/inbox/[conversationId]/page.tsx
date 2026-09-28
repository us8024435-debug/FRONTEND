import * as React from "react";
import type { Metadata } from "next";
import { InboxView } from "@/components/inbox/InboxView";
import InboxLoading from "../loading";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { conversationId } = await params;
  return {
    title: `Chat ${conversationId} — Inbox | WhatsApp CRM`,
    description: "WhatsApp active conversation and customer detail timeline.",
  };
}

export default async function ConversationDetailPage({ params }: PageProps) {
  const { conversationId } = await params;

  return (
    <React.Suspense fallback={<InboxLoading />}>
      <InboxView initialConversationId={conversationId} />
    </React.Suspense>
  );
}
