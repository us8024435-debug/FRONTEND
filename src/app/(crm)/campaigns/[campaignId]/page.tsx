"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Users,
  Calendar,
  Clock,
  Send,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { queryKeys, fetchCampaign } from "@/lib/api";
import { useUIStore } from "@/lib/stores/uiStore";
import { formatRelativeTime } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TemplatePreview } from "@/components/crm/TemplatePreview";

import { CampaignStatsGrid } from "@/components/campaigns/CampaignStatsGrid";
import { CampaignFunnelChart } from "@/components/campaigns/CampaignFunnelChart";
import { CampaignTimeline } from "@/components/campaigns/CampaignTimeline";
import { CampaignRecipientPreview } from "@/components/campaigns/CampaignRecipientPreview";
import CampaignDetailLoading from "./loading";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("campaigns");
  }, [setActiveModule]);

  const {
    data: campaignResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.campaigns.detail(campaignId),
    queryFn: () => fetchCampaign(campaignId),
    enabled: Boolean(campaignId),
  });

  const campaign = campaignResponse?.data;

  if (isLoading) {
    return <CampaignDetailLoading />;
  }

  if (error || !campaign) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <EmptyState
          icon={AlertCircle}
          title="Campaign Not Found"
          description={`Unable to locate broadcast campaign with ID "${campaignId}".`}
          actionLabel="Back to Campaigns"
          onAction={() => router.push("/campaigns")}
        />
      </div>
    );
  }

  const dateLabel =
    campaign.status === "scheduled" && campaign.scheduledAt
      ? `Scheduled for ${new Date(campaign.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`
      : campaign.sentAt
        ? `Sent ${formatRelativeTime(campaign.sentAt)}`
        : `Created ${formatRelativeTime(campaign.createdAt)}`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation / Back Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/campaigns")}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Campaigns</span>
        </Button>

        <div className="flex items-center gap-2">
          <StatusBadge status={campaign.status} variant="campaign" />
        </div>
      </div>

      {/* 1. Header Card */}
      <Card className="border-border shadow-2xs overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {campaign.name}
                </h1>
                <StatusBadge status={campaign.status} variant="campaign" />
              </div>
              <p className="text-xs font-mono text-muted-foreground">Campaign ID: {campaign.id}</p>
            </div>

            {/* Quick Meta Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Template Pill */}
              <Link
                href={`/templates/${campaign.templateId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-foreground font-medium"
              >
                <FileText className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{campaign.template?.displayName || campaign.templateId}</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </Link>

              {/* Audience Count Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-foreground font-medium">
                <Users className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>{campaign.audienceCount.toLocaleString()} Audience</span>
              </div>

              {/* Date Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted-foreground">
                <Clock className="size-3.5" />
                <span>{dateLabel}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Stats Grid (4 Cards: Total Sent, Delivered %, Read %, Failed %) */}
      <CampaignStatsGrid stats={campaign.stats} />

      {/* 3. Main Grid: Left 60% (Funnel + Recipient Table) | Right 40% (Timeline + Template Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (60%): Funnel Chart + Recipient Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Funnel Chart */}
          <CampaignFunnelChart stats={campaign.stats} />

          {/* Recipient Preview DataTable */}
          <CampaignRecipientPreview campaign={campaign} />
        </div>

        {/* Right Column (40%): Timeline + Message Template Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Campaign Timeline */}
          <CampaignTimeline campaign={campaign} />

          {/* Message Template Used Preview */}
          {campaign.template && (
            <Card className="border-border shadow-2xs">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <FileText className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Template Message</span>
                </div>
                <Link
                  href={`/templates/${campaign.templateId}`}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>View Details</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
              <div className="p-4 flex justify-center bg-muted/10">
                <TemplatePreview
                  header={campaign.template.header}
                  body={campaign.template.body}
                  footer={campaign.template.footer}
                  buttons={campaign.template.buttons}
                  className="w-full text-xs shadow-none border-border/60"
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
