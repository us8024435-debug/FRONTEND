"use client";

import * as React from "react";
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
import { CampaignStats } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface CampaignFunnelChartProps {
  stats: CampaignStats;
}

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
            % of Sent:{" "}
            <span className="font-semibold text-foreground">{item.percentage.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function CampaignFunnelChart({ stats }: CampaignFunnelChartProps) {
  const sentTotal = stats.sent || 1;

  const data: FunnelItem[] = React.useMemo(() => {
    return [
      {
        stage: "Sent",
        count: stats.sent,
        percentage: 100,
        color: "#3B82F6",
      },
      {
        stage: "Delivered",
        count: stats.delivered,
        percentage: (stats.delivered / sentTotal) * 100,
        color: "#10B981",
      },
      {
        stage: "Read",
        count: stats.read,
        percentage: (stats.read / sentTotal) * 100,
        color: "#8B5CF6",
      },
      {
        stage: "Replied",
        count: stats.replied,
        percentage: (stats.replied / sentTotal) * 100,
        color: "#14B8A6",
      },
      {
        stage: "Failed",
        count: stats.failed,
        percentage: (stats.failed / sentTotal) * 100,
        color: "#F43F5E",
      },
    ];
  }, [stats, sentTotal]);

  return (
    <Card className="border-border shadow-2xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Delivery Funnel</CardTitle>
        <CardDescription className="text-xs">
          Message progression from outbound broadcast to recipient interaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted/40" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={(v) => Number(v).toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fontSize: 12, fontWeight: 500 }}
                className="text-foreground"
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={22}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
