"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Bell,
  Cpu,
  Users2,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  Radio,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/stores/uiStore";
import { resetDemoData } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  // Active module highlight in sidebar
  React.useEffect(() => {
    setActiveModule("settings");
  }, [setActiveModule]);

  // Notifications State (all pre-set to enabled)
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [inAppNotifications, setInAppNotifications] = React.useState(true);
  const [newMessageAlert, setNewMessageAlert] = React.useState(true);
  const [campaignCompletionAlert, setCampaignCompletionAlert] = React.useState(true);

  // Team Settings State
  const [maxConversations, setMaxConversations] = React.useState(15);
  const [autoAssignment, setAutoAssignment] = React.useState(true);

  // Reset Demo Data Dialog State
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [copiedWebhook, setCopiedWebhook] = React.useState(false);

  const webhookUrl = "https://api.mindclubcrm.org/v1/webhooks/whatsapp/inbound";

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    toast.success("Webhook URL copied to clipboard");
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleResetDemoData = async () => {
    try {
      setIsResetting(true);
      resetDemoData();
      await queryClient.invalidateQueries();
      toast.success("Demo Data Reset Successfully", {
        description:
          "All contacts, conversations, templates, and metrics have been reset to factory defaults.",
      });
    } catch (err) {
      console.error("Failed to reset demo data:", err);
      toast.error("Failed to reset demo data");
    } finally {
      setIsResetting(false);
      setResetDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader title="Settings" description="Configure your WhatsApp CRM" />

      {/* Settings Navigation Tabs */}
      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/70 rounded-xl">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 py-2.5 text-xs sm:text-sm data-[state=checked]:bg-background data-[state=checked]:shadow-xs rounded-lg"
          >
            <Building2 className="size-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 py-2.5 text-xs sm:text-sm data-[state=checked]:bg-background data-[state=checked]:shadow-xs rounded-lg"
          >
            <Bell className="size-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="flex items-center gap-2 py-2.5 text-xs sm:text-sm data-[state=checked]:bg-background data-[state=checked]:shadow-xs rounded-lg"
          >
            <Cpu className="size-4" />
            <span>API Configuration</span>
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center gap-2 py-2.5 text-xs sm:text-sm data-[state=checked]:bg-background data-[state=checked]:shadow-xs rounded-lg"
          >
            <Users2 className="size-4" />
            <span>Team Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. General Tab */}
        <TabsContent value="general" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/70 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
              <CardDescription className="text-xs">
                Manage your organization details and WhatsApp Cloud API account credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-xs font-medium">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  defaultValue="MindClub Foundation"
                  className="max-w-md h-9 text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  The verified business name displayed in Meta Business Manager.
                </p>
              </div>

              {/* WhatsApp Business Account ID */}
              <div className="space-y-2">
                <Label htmlFor="wabaId" className="text-xs font-medium">
                  WhatsApp Business Account ID (WABA)
                </Label>
                <div className="flex max-w-md items-center gap-2">
                  <Input
                    id="wabaId"
                    value="••••••1234"
                    readOnly
                    className="h-9 font-mono text-sm bg-muted/40 cursor-not-allowed select-none"
                  />
                  <Badge
                    variant="outline"
                    className="text-[11px] shrink-0 gap-1 text-muted-foreground"
                  >
                    <Lock className="size-3" />
                    Masked
                  </Badge>
                </div>
              </div>

              {/* Phone Number ID */}
              <div className="space-y-2">
                <Label htmlFor="phoneId" className="text-xs font-medium">
                  Phone Number ID
                </Label>
                <div className="flex max-w-md items-center gap-2">
                  <Input
                    id="phoneId"
                    value="••••••5678"
                    readOnly
                    className="h-9 font-mono text-sm bg-muted/40 cursor-not-allowed select-none"
                  />
                  <Badge
                    variant="outline"
                    className="text-[11px] shrink-0 gap-1 text-muted-foreground"
                  >
                    <Lock className="size-3" />
                    Masked
                  </Badge>
                </div>
              </div>

              {/* Timezone Select */}
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-xs font-medium">
                  Operating Timezone
                </Label>
                <div className="max-w-md">
                  <Select defaultValue="Asia/Kolkata">
                    <SelectTrigger id="timezone" className="h-9 text-sm">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST, UTC+05:30)</SelectItem>
                      <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EDT, UTC-04:00)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        America/Los_Angeles (PDT, UTC-07:00)
                      </SelectItem>
                      <SelectItem value="Europe/London">Europe/London (BST, UTC+01:00)</SelectItem>
                      <SelectItem value="Asia/Singapore">
                        Asia/Singapore (SGT, UTC+08:00)
                      </SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST, UTC+04:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Used for scheduled broadcast campaigns and business hour calculation.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/60 pt-4 flex justify-between">
              <span className="text-xs text-muted-foreground">
                Settings changes are locked in demo sandbox mode.
              </span>
              <Button disabled size="sm" className="h-8 text-xs">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 2. Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/70 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
              <CardDescription className="text-xs">
                Configure alerts and event triggers for your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 divide-y divide-border/60 [&>*:not(:first-child)]:pt-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="text-sm font-medium">
                    Email notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive daily summaries and critical account security alerts via email.
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              {/* In-app notifications */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="inAppNotifications" className="text-sm font-medium">
                    In-app notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show desktop notification toast popups and header bell indicators.
                  </p>
                </div>
                <Switch
                  id="inAppNotifications"
                  checked={inAppNotifications}
                  onCheckedChange={setInAppNotifications}
                />
              </div>

              {/* New message alert */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="newMessageAlert" className="text-sm font-medium">
                    New message alert
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Play sound chime and trigger immediate alert when a customer replies.
                  </p>
                </div>
                <Switch
                  id="newMessageAlert"
                  checked={newMessageAlert}
                  onCheckedChange={setNewMessageAlert}
                />
              </div>

              {/* Campaign completion alert */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="campaignCompletionAlert" className="text-sm font-medium">
                    Campaign completion alert
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notify when a broadcast campaign finishes sending to all audience contacts.
                  </p>
                </div>
                <Switch
                  id="campaignCompletionAlert"
                  checked={campaignCompletionAlert}
                  onCheckedChange={setCampaignCompletionAlert}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. API Configuration Tab */}
        <TabsContent value="api" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/70 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">API & Webhook Engine</CardTitle>
              <CardDescription className="text-xs">
                Manage WhatsApp Cloud API connection, mock simulation mode, and webhooks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* API Mode Display */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-muted/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">API Operating Mode:</span>
                    <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
                      Mock
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Simulating WhatsApp Business Cloud API responses with zero external rate limits.
                  </p>
                </div>
                <Button disabled variant="outline" size="sm" className="h-8 text-xs shrink-0">
                  Switch to Real API
                </Button>
              </div>

              {/* Webhook URL Display */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Inbound Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={webhookUrl}
                    className="font-mono text-xs bg-muted/40 h-9"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyWebhook}
                    className="h-9 gap-1.5 px-3 text-xs shrink-0"
                  >
                    {copiedWebhook ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Provide this endpoint in Meta WhatsApp App settings under Webhook configuration.
                </p>
              </div>

              {/* Connection Status Indicator */}
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Radio className="size-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Connected
                      </span>
                      <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Cloud API webhook listener is active and processing delivery callbacks.
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                >
                  Healthy
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Team Settings Tab */}
        <TabsContent value="team" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/70 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Agent & Capacity Rules</CardTitle>
              <CardDescription className="text-xs">
                Configure auto-assignment algorithms and workload thresholds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Max conversations per agent */}
              <div className="space-y-2">
                <Label htmlFor="maxConversations" className="text-xs font-medium">
                  Default Max Active Conversations Per Agent
                </Label>
                <div className="flex max-w-xs items-center gap-3">
                  <Input
                    id="maxConversations"
                    type="number"
                    min={1}
                    max={50}
                    value={maxConversations}
                    onChange={(e) => setMaxConversations(parseInt(e.target.value) || 1)}
                    className="h-9 text-sm"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">chats / agent</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  When an agent reaches this concurrency limit, new chats route to remaining agents.
                </p>
              </div>

              {/* Auto-assignment toggle */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/60">
                <div className="space-y-0.5">
                  <Label htmlFor="autoAssignment" className="text-sm font-medium">
                    Auto-assignment (Round-Robin)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically distribute unassigned inbound customer chats to online agents with
                    available capacity.
                  </p>
                </div>
                <Switch
                  id="autoAssignment"
                  checked={autoAssignment}
                  onCheckedChange={setAutoAssignment}
                />
              </div>

              {/* Business hours configuration placeholder */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Business Hours Configuration</Label>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Placeholder
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-lg border border-border/70 bg-muted/20">
                  <Clock className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-foreground">
                      Monday – Friday: 09:00 AM – 06:00 PM (IST)
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Messages received outside business hours trigger out-of-office autoreply
                      workflow.
                    </p>
                  </div>
                  <Button disabled variant="outline" size="sm" className="h-7 text-xs">
                    Edit Hours
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 5. Bottom: Reset Demo Data Card */}
      <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5 stroke-[2]" />
            <CardTitle className="text-base font-semibold">Demo Environment Controls</CardTitle>
          </div>
          <CardDescription className="text-xs text-destructive/80">
            Restore all modified contacts, campaigns, templates, tags, and conversation threads back
            to their initial factory demo state.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          This operation clears in-memory state mutations and invalidates all React Query caches
          across the CRM.
        </CardContent>
        <CardFooter className="pt-2 border-t border-destructive/15 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">Action: resetDemoData()</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            className="gap-2 text-xs font-medium shadow-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Demo Data</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset All Demo Data?"
        description="Are you sure you want to reset all CRM demo data? All newly created campaigns, edited templates, contacts, and active conversations will be restored to factory defaults."
        confirmLabel="Reset Demo Data"
        cancelLabel="Cancel"
        destructive={true}
        loading={isResetting}
        onConfirm={handleResetDemoData}
      />
    </div>
  );
}
