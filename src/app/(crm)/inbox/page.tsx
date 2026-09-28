import * as React from "react";
import type { Metadata } from "next";
import { InboxView } from "@/components/inbox/InboxView";
import InboxLoading from "./loading";

export const metadata: Metadata = {
  title: "Inbox — WhatsApp CRM",
  description: "Enterprise WhatsApp multi-agent conversation management and messaging.",
};

export default function InboxPage() {
  return (
    <React.Suspense fallback={<InboxLoading />}>
      <InboxView />
    </React.Suspense>
  );
}
