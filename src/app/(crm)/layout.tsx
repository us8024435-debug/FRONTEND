import * as React from "react";
import type { Metadata } from "next";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { CommandSearch } from "@/components/shared/CommandSearch";

export const metadata: Metadata = {
  title: "WhatsApp CRM — Business Messaging & Operations",
  description:
    "Enterprise WhatsApp Business CRM Platform with real-time conversations, campaign automation, and analytics.",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Persistent Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>

      {/* Global ⌘K Command Dialog */}
      <CommandSearch />
    </div>
  );
}
