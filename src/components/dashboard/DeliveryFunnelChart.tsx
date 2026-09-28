"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { queryKeys, fetchDashboardMetrics } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FunnelItem {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: FunnelItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    if (!item) return null;

    return (
      <div className="rounded-lg border border-border bg-popover/95 p-3 text-xs shadow-md backdrop-blur-xs">
        <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.stage}
        </p>
        <div className="space-y-0.5 text-muted-foreground">
          <p>
            Count: <span className="font-bold text-foreground">{item.count.toLocaleString()}</span>
          </p>
          <p>
            Conversion of Sent:{" "}
            <span className="font-semibold text-foreground">{item.percentage.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function DeliveryFunnelChart() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
  });

  const funnel = data?.data?.deliveryFunnel;
  const sentTotal = funnel?.sent || 1;

  const funnelData: FunnelItem[] = React.useMemo(() => {
    if (!funnel) return [];

    return [
      {
        stage: "Sent",
        count: funnel.sent,
        percentage: 100,
        color: "#3B82F6", // Blue
      },
      {
        stage: "Delivered",
        count: funnel.delivered,
        percentage: (funnel.delivered / sentTotal) * 100,
        color: "#10B981", // Green
      },
      {
        stage: "Read",
        count: funnel.read,
        percentage: (funnel.read / sentTotal) * 100,
        color: "#F59E0B", // Yellow
      },
      {
        stage: "Replied",
        count: funnel.replied,
        percentage: (funnel.replied / sentTotal) * 100,
        color: "#F97316", // Orange
      },
      {
        stage: "Failed",
        count: funnel.failed,
        percentage: (funnel.failed / sentTotal) * 100,
        color: "#EF4444", // Red
      },
    ];
  }, [funnel, sentTotal]);

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Delivery Funnel</CardTitle>
            <CardDescription className="text-xs">
              Conversion progression from dispatched broadcast to incoming customer reply
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={funnelData}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`)}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {funnelData.map((entry) => (
                    <Cell key={entry.stage} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
