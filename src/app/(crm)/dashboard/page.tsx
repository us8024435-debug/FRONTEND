"use client";

import * as React from "react";
import { RefreshCw, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/api";
import { useUIStore } from "@/lib/stores/uiStore";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { MessageVolumeChart } from "@/components/dashboard/MessageVolumeChart";
import { DeliveryFunnelChart } from "@/components/dashboard/DeliveryFunnelChart";
import { CampaignPerformanceChart } from "@/components/dashboard/CampaignPerformanceChart";
import { RecentConversationsTable } from "@/components/dashboard/RecentConversationsTable";
import { AgentPerformanceTable } from "@/components/dashboard/AgentPerformanceTable";
import { TopTemplatesTable } from "@/components/dashboard/TopTemplatesTable";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("dashboard");
  }, [setActiveModule]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all }),
      ]);
      toast.success("Dashboard metrics refreshed");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in-50 duration-200">
      {/* 1. Dashboard Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your WhatsApp CRM performance, messaging volume, delivery rates, and agent efficiency."
        actions={
          <div className="flex items-center gap-2">
            <DateRangePicker className="max-w-[260px] hidden sm:block" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5 text-xs"
            >
              <RefreshCw
                className={`size-3.5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        }
      />

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <DashboardKPIs />

      {/* 3. Primary Charts: Message Volume & Delivery Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MessageVolumeChart />
        <DeliveryFunnelChart />
      </div>

      {/* 4. Secondary Row: Campaign Breakdown & Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignPerformanceChart />
        <RecentConversationsTable />
      </div>

      {/* 5. Tertiary Row: Agent Leaderboard & Top Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPerformanceTable />
        <TopTemplatesTable />
      </div>
    </div>
  );
}
