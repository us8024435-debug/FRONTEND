"use client";

import * as React from "react";
import { Send, CheckCircle2, Eye, AlertTriangle } from "lucide-react";
import { CampaignStats } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export interface CampaignStatsGridProps {
  stats: CampaignStats;
}

export function CampaignStatsGrid({ stats }: CampaignStatsGridProps) {
  const sent = stats.sent || 0;
  const delivPct = sent > 0 ? ((stats.delivered / sent) * 100).toFixed(1) : "0.0";
  const readPct = sent > 0 ? ((stats.read / sent) * 100).toFixed(1) : "0.0";
  const failedPct = sent > 0 ? ((stats.failed / sent) * 100).toFixed(1) : "0.0";

  const cards = [
    {
      label: "Total Sent",
      value: sent.toLocaleString(),
      subtext: `${stats.total.toLocaleString()} total audience`,
      icon: Send,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Delivered",
      value: `${delivPct}%`,
      subtext: `${stats.delivered.toLocaleString()} delivered successfully`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Read Rate",
      value: `${readPct}%`,
      subtext: `${stats.read.toLocaleString()} opened & read`,
      icon: Eye,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Failed Rate",
      value: `${failedPct}%`,
      subtext: `${stats.failed.toLocaleString()} delivery failures`,
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="border-border shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{card.subtext}</p>
              </div>

              <div
                className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${card.bg} ${card.border}`}
              >
                <Icon className={`size-5 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
