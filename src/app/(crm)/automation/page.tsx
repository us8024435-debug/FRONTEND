"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GitBranch,
  Plus,
  Zap,
  Clock,
  ShoppingCart,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/stores/uiStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

interface MockWorkflow {
  id: string;
  name: string;
  status: "active" | "draft";
  trigger: string;
  createdAt: string;
  executions: number;
  nodeCount: number;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const mockWorkflows: MockWorkflow[] = [
  {
    id: "welcome-message",
    name: "Welcome Message",
    status: "active",
    trigger: "New Message Received",
    createdAt: "Sep 24, 2026",
    executions: 1420,
    nodeCount: 5,
    icon: MessageSquare,
    accentColor: "emerald",
  },
  {
    id: "follow-up-reminder",
    name: "Follow-up Reminder",
    status: "active",
    trigger: "No reply after 24 hours",
    createdAt: "Sep 20, 2026",
    executions: 843,
    nodeCount: 4,
    icon: Clock,
    accentColor: "blue",
  },
  {
    id: "abandoned-cart",
    name: "Abandoned Cart",
    status: "draft",
    trigger: "Checkout initiated without purchase",
    createdAt: "Sep 15, 2026",
    executions: 0,
    nodeCount: 6,
    icon: ShoppingCart,
    accentColor: "amber",
  },
];

export default function AutomationListPage() {
  const router = useRouter();
  const [workflows] = React.useState<MockWorkflow[]>(mockWorkflows);
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("automation");
  }, [setActiveModule]);

  const handleCreateWorkflow = () => {
    toast.info("Workflow Builder", {
      description:
        "Interactive drag-and-drop workflow creator is in preview mode. Click on any workflow below to inspect the canvas.",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Automation"
        description="Build workflow automations for your messages"
        actions={
          <Button
            onClick={handleCreateWorkflow}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
          >
            <Plus className="size-4" />
            <span>Create Workflow</span>
          </Button>
        }
      />

      {/* Overview Banner / Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-border/70 bg-card shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <GitBranch className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Workflows</p>
            <p className="text-xl font-bold tracking-tight text-foreground">3</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-border/70 bg-card shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Activity className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Active Automations</p>
            <p className="text-xl font-bold tracking-tight text-foreground">2 Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-border/70 bg-card shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Zap className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Triggers Fired</p>
            <p className="text-xl font-bold tracking-tight text-foreground">2,263</p>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Configured Workflows
          </h2>
          <span className="text-xs text-muted-foreground">
            Select a workflow to open interactive canvas
          </span>
        </div>

        {workflows.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="Create your first workflow"
            description="Build workflow automations for your messages"
            actionLabel="Create Workflow"
            onAction={handleCreateWorkflow}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;

              return (
                <Card
                  key={workflow.id}
                  onClick={() => router.push(`/automation/${workflow.id}`)}
                  className="group relative cursor-pointer overflow-hidden border border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
                >
                  {/* Top Subtle Color Accent Bar */}
                  <div
                    className={
                      workflow.status === "active"
                        ? "h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        : "h-1 w-full bg-muted"
                    }
                  />

                  <CardContent className="p-5 flex flex-col justify-between h-[210px]">
                    <div>
                      {/* Header Row: Icon + Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          <Icon className="size-4.5" />
                        </div>
                        <StatusBadge status={workflow.status} variant="workflow" />
                      </div>

                      {/* Workflow Name */}
                      <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {workflow.name}
                      </h3>

                      {/* Trigger description */}
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Zap className="size-3.5 shrink-0 text-amber-500 mt-0.5" />
                        <span className="line-clamp-2">
                          Trigger:{" "}
                          <strong className="text-foreground/80 font-medium">
                            {workflow.trigger}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Card Footer: Metadata + Navigation link */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Layers className="size-3" />
                          {workflow.nodeCount} nodes
                        </span>
                        <span>•</span>
                        <span>Created {workflow.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Flow</span>
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
