"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useUIStore } from "@/lib/stores/uiStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

// DYNAMICALLY IMPORT React Flow canvas with ssr: false for bundle size and SSR safety
const WorkflowCanvas = dynamic(
  () => import("@/components/automation/WorkflowCanvas").then((mod) => mod.WorkflowCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-56px)] w-full flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading interactive workflow canvas...
          </p>
        </div>
        <div className="absolute inset-x-8 bottom-8 top-20 -z-10 rounded-2xl border border-dashed border-border/50 bg-muted/20" />
      </div>
    ),
  },
);

const mockWorkflowDetails: Record<
  string,
  { name: string; status: "active" | "draft"; trigger: string }
> = {
  "welcome-message": {
    name: "Welcome Message",
    status: "active",
    trigger: "New Message Received",
  },
  "follow-up-reminder": {
    name: "Follow-up Reminder",
    status: "active",
    trigger: "No reply after 24 hours",
  },
  "abandoned-cart": {
    name: "Abandoned Cart",
    status: "draft",
    trigger: "Checkout initiated without purchase",
  },
  wf_01: {
    name: "Welcome Message",
    status: "active",
    trigger: "New Message Received",
  },
  wf_02: {
    name: "Follow-up Reminder",
    status: "active",
    trigger: "No reply after 24 hours",
  },
  wf_03: {
    name: "Abandoned Cart",
    status: "draft",
    trigger: "Checkout initiated without purchase",
  },
};

export default function WorkflowDetailPage() {
  const params = useParams();
  const workflowId = (params?.workflowId as string) || "welcome-message";
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("automation");
  }, [setActiveModule]);

  const details = mockWorkflowDetails[workflowId] || {
    name: workflowId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    status: "active" as const,
    trigger: "New Message Received",
  };

  return (
    <div className="h-[calc(100vh-56px)] w-full overflow-hidden">
      <WorkflowCanvas workflowId={workflowId} workflowName={details.name} status={details.status} />
    </div>
  );
}
