"use client";

import * as React from "react";
import { Users, MessageSquare, Send, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, fetchDashboardMetrics } from "@/lib/api";
import { MetricCard } from "@/components/crm/MetricCard";

export function DashboardKPIs() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
  });

  const metrics = data?.data;

  // Format average response time into seconds or minutes
  const responseTimeValue = metrics?.responseTime?.average ?? 48;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Contacts */}
      <MetricCard
        title="Total Contacts"
        value={metrics?.totalContacts ?? 0}
        change={12.5}
        changeType="up"
        icon={Users}
        loading={isLoading}
      />

      {/* Active Conversations */}
      <MetricCard
        title="Active Conversations"
        value={metrics?.activeConversations ?? 0}
        change={5.4}
        changeType="up"
        icon={MessageSquare}
        loading={isLoading}
      />

      {/* Messages Today */}
      <MetricCard
        title="Messages Today"
        value={metrics?.messagesToday ?? 0}
        change={18.2}
        changeType="up"
        icon={Send}
        loading={isLoading}
      />

      {/* Avg Response Time */}
      <MetricCard
        title="Avg Response Time"
        value={responseTimeValue}
        suffix="s"
        change={3.2}
        changeType="down"
        icon={Clock}
        loading={isLoading}
      />
    </div>
  );
}
