"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, fetchDashboardMetrics } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentPerformanceTable() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
  });

  const agents = data?.data?.agentPerformance ?? [];

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Agent Performance</CardTitle>
        <CardDescription className="text-xs">
          Resolution speed, response metrics, and customer satisfaction ratings
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
                <Skeleton className="h-3.5 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                  <th className="text-left py-2 pb-2.5 font-medium">Agent</th>
                  <th className="text-center py-2 pb-2.5 font-medium">Resolved</th>
                  <th className="text-center py-2 pb-2.5 font-medium">Avg Speed</th>
                  <th className="text-right py-2 pb-2.5 font-medium">Satisfaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {agents.map((agent) => {
                  const satisfactionPercent = Math.min(
                    100,
                    Math.round((agent.satisfaction / 5.0) * 100),
                  );

                  return (
                    <tr key={agent.agentId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm" className="ring-1 ring-border">
                            <AvatarFallback className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {getInitials(agent.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                            {agent.name}
                          </span>
                        </div>
                      </td>

                      <td className="text-center py-2.5 px-2">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
                          {agent.resolved}
                        </span>
                      </td>

                      <td className="text-center py-2.5 px-2 text-muted-foreground font-medium">
                        {agent.avgResponseTime}s
                      </td>

                      <td className="text-right py-2.5 pl-2">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-foreground">
                            {agent.satisfaction.toFixed(2)}{" "}
                            <span className="text-[10px] text-muted-foreground font-normal">
                              / 5.0
                            </span>
                          </span>
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${satisfactionPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
