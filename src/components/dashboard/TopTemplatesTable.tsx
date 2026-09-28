"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle2 } from "lucide-react";
import { queryKeys, fetchDashboardMetrics } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TopTemplatesTable() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
  });

  const templates = data?.data?.topTemplates ?? [];

  const formatTemplateName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Top Templates</CardTitle>
        <CardDescription className="text-xs">
          High-volume pre-approved templates ranked by engagement and read rate
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                  <th className="text-left py-2 pb-2.5 font-medium">Template Name</th>
                  <th className="text-right py-2 pb-2.5 font-medium">Dispatched</th>
                  <th className="text-right py-2 pb-2.5 font-medium">Delivery</th>
                  <th className="text-right py-2 pb-2.5 font-medium">Read Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {templates.map((tpl) => (
                  <tr key={tpl.templateId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-emerald-500 shrink-0" />
                        <div className="flex flex-col truncate">
                          <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {formatTemplateName(tpl.name)}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate">
                            {tpl.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="text-right py-2.5 px-2 font-semibold text-foreground">
                      {tpl.sentCount.toLocaleString()}
                    </td>

                    <td className="text-right py-2.5 px-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        {tpl.deliveryRate.toFixed(1)}%
                      </span>
                    </td>

                    <td className="text-right py-2.5 pl-2">
                      <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-600 dark:text-blue-400 text-[11px]">
                        {tpl.readRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
