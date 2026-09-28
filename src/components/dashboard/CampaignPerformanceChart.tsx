"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { queryKeys, fetchDashboardMetrics } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#10B981", "#6366F1", "#F59E0B", "#06B6D4", "#EC4899"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      delivered: number;
      read: number;
      deliveryRate: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0];
    if (!item) return null;

    return (
      <div className="rounded-lg border border-border bg-popover/95 p-3 text-xs shadow-md backdrop-blur-xs">
        <p className="font-semibold text-foreground mb-1">{item.name}</p>
        <div className="space-y-0.5 text-muted-foreground">
          <p>
            Sent: <span className="font-bold text-foreground">{item.value.toLocaleString()}</span>
          </p>
          <p>
            Delivered:{" "}
            <span className="font-semibold text-emerald-500">
              {item.payload.delivered.toLocaleString()} ({item.payload.deliveryRate.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function CampaignPerformanceChart() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
  });

  const chartData = React.useMemo(() => {
    const campaigns = data?.data?.campaignPerformance ?? [];
    return campaigns
      .filter((c) => (c.stats.sent || 0) > 0)
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        value: c.stats.sent,
        delivered: c.stats.delivered,
        read: c.stats.read,
        deliveryRate: c.stats.sent > 0 ? (c.stats.delivered / c.stats.sent) * 100 : 0,
      }));
  }, [data?.data?.campaignPerformance]);

  const totalBroadcasts = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Campaign Performance</CardTitle>
            <CardDescription className="text-xs">
              Delivery share and engagement by major broadcast campaigns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <Skeleton className="size-48 rounded-full" />
          </div>
        ) : (
          <>
            <div className="relative h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Donut center stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-foreground">
                  {totalBroadcasts >= 1000
                    ? `${(totalBroadcasts / 1000).toFixed(1)}k`
                    : totalBroadcasts}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                  Dispatched
                </span>
              </div>
            </div>

            {/* Legend breakdown below chart */}
            <div className="space-y-1.5 pt-3 border-t border-border/60">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 max-w-[70%]">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      ({item.deliveryRate.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
