"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Megaphone,
  Plus,
  Rocket,
  Send,
  Users,
  FileText,
  X,
  ClipboardList,
  AlertCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motionConfig } from "@/lib/motion";
import {
  campaignStep1Schema,
  campaignStep2Schema,
  campaignStep3Schema,
  campaignStep4Schema,
  campaignSchema,
  type CampaignStep1Input,
  type CampaignStep2Input,
  type CampaignStep3Input,
  type CampaignStep4Input,
} from "@/lib/validators/campaign";
import type { CreateCampaignInput, Template, Segment } from "@/lib/types";
import { useCampaignWizardStore } from "@/lib/stores/campaignWizardStore";
import { useCreateCampaign } from "@/lib/hooks/useCampaigns";
import { queryKeys, fetchSegments, fetchTemplates } from "@/lib/api";
import { TemplatePreview } from "@/components/crm/TemplatePreview";
import { SegmentCard } from "./SegmentCard";
import { AudienceFilterBuilder } from "./AudienceFilterBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ───────────────────────────────────────────────────────
// Wizard Step Definitions
// ───────────────────────────────────────────────────────

const STEPS = [
  { label: "Name", icon: Megaphone, description: "Campaign name" },
  { label: "Audience", icon: Users, description: "Select audience" },
  { label: "Template", icon: FileText, description: "Choose template" },
  { label: "Review", icon: ClipboardList, description: "Review & send" },
] as const;

// ───────────────────────────────────────────────────────
// Stepper Component
// ───────────────────────────────────────────────────────

function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto py-6">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.label}>
            {/* Step circle */}
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <div
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted &&
                    "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
                  isCurrent &&
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-500/10",
                  !isCompleted &&
                    !isCurrent &&
                    "border-muted-foreground/20 bg-muted/50 text-muted-foreground/50",
                )}
              >
                {isCompleted ? (
                  <Check className="size-4.5 stroke-[2.5]" />
                ) : (
                  <Icon className="size-4.5" />
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-[11px] font-semibold tracking-wide uppercase transition-colors",
                    isCurrent
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground/50",
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-22px] rounded-full overflow-hidden bg-muted-foreground/10">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    index < currentStep ? "w-full bg-emerald-500" : "w-0 bg-emerald-500",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Step 1: Campaign Name
// ───────────────────────────────────────────────────────

function Step1CampaignName({ form }: { form: ReturnType<typeof useForm<CreateCampaignInput>> }) {
  const {
    register,
    formState: { errors },
  } = form;

  // Manage a local description value (not in schema — purely visual)
  const [description, setDescription] = React.useState("");

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-2">
          <Megaphone className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Name your campaign</h2>
        <p className="text-sm text-muted-foreground">
          Give your broadcast a clear, descriptive name
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="campaign-name" className="text-sm font-semibold">
            Campaign Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="campaign-name"
            placeholder="e.g. Diwali Sale Announcement"
            className="h-12 text-base font-medium border-2 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
              <AlertCircle className="size-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign-desc" className="text-sm font-medium text-muted-foreground">
            Description <span className="text-muted-foreground/50">(optional)</span>
          </Label>
          <Textarea
            id="campaign-desc"
            placeholder="Internal notes about this campaign..."
            className="min-h-[100px] resize-none border-2 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Step 2: Select Audience
// ───────────────────────────────────────────────────────

function Step2SelectAudience({ form }: { form: ReturnType<typeof useForm<CreateCampaignInput>> }) {
  const {
    setValue,
    formState: { errors },
  } = form;
  const selectedSegmentId = useWatch({ control: form.control, name: "segmentId" });
  const [showFilterBuilder, setShowFilterBuilder] = React.useState(false);

  const { data: segmentsResult, isLoading } = useQuery({
    queryKey: queryKeys.segments.list(),
    queryFn: fetchSegments,
  });

  const segments: Segment[] = segmentsResult?.data ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
          <Users className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Choose your audience</h2>
        <p className="text-sm text-muted-foreground">
          Select an existing segment or build a custom audience
        </p>
      </div>

      {errors.segmentId && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <AlertCircle className="size-4 text-red-500" />
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            {errors.segmentId.message}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted/50 animate-pulse border border-border/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {segments.map((segment) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              isSelected={selectedSegmentId === segment.id}
              onClick={() =>
                setValue("segmentId", segment.id, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          ))}
        </div>
      )}

      {/* Create New Segment toggle */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 border-dashed w-full"
          onClick={() => setShowFilterBuilder((v) => !v)}
        >
          <Plus className="size-3.5" />
          {showFilterBuilder ? "Hide Filter Builder" : "Create New Segment"}
        </Button>

        {showFilterBuilder && (
          <div className="p-4 rounded-xl border-2 border-dashed border-border bg-muted/10 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Custom Audience Filters
            </p>
            <AudienceFilterBuilder
              onChange={() => {
                /* filters are visual-only here; segment selection drives the form */
              }}
            />
          </div>
        )}
      </div>

      {/* Selected segment highlight */}
      {selectedSegmentId && (
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
          <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {segments.find((s) => s.id === selectedSegmentId)?.estimatedCount.toLocaleString() ??
              "0"}{" "}
            contacts will receive this campaign
          </span>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Step 3: Select Template
// ───────────────────────────────────────────────────────

function Step3SelectTemplate({ form }: { form: ReturnType<typeof useForm<CreateCampaignInput>> }) {
  const {
    setValue,
    formState: { errors },
  } = form;
  const selectedTemplateId = useWatch({ control: form.control, name: "templateId" });
  const variables = useWatch({ control: form.control, name: "variables" }) ?? {};

  const { data: templatesResult, isLoading } = useQuery({
    queryKey: queryKeys.templates.list({}),
    queryFn: () => fetchTemplates({}),
  });

  const templates: Template[] = templatesResult?.data ?? [];
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const templateVars = selectedTemplate?.body?.variables ?? [];

  /** Update a single variable value */
  const handleVarChange = React.useCallback(
    (varName: string, value: string) => {
      setValue("variables", { ...variables, [varName]: value }, { shouldDirty: true });
    },
    [setValue, variables],
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-2">
          <FileText className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Choose a template</h2>
        <p className="text-sm text-muted-foreground">
          Select an approved WhatsApp template for your campaign
        </p>
      </div>

      {errors.templateId && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 max-w-2xl mx-auto">
          <AlertCircle className="size-4 text-red-500" />
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            {errors.templateId.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Template list */}
        <div className="lg:col-span-3 space-y-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-muted/50 animate-pulse border border-border/50"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {templates.map((template) => {
                const isApproved = template.status === "approved";
                const isSelected = selectedTemplateId === template.id;

                return (
                  <TooltipProvider key={template.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={!isApproved}
                          onClick={() => {
                            if (isApproved) {
                              setValue("templateId", template.id, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              // Clear variables when switching template
                              setValue("variables", {}, { shouldDirty: true });
                            }
                          }}
                          className={cn(
                            "relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                            !isApproved &&
                              "opacity-50 cursor-not-allowed border-border/40 bg-muted/30",
                            isApproved &&
                              !isSelected &&
                              "border-border/60 bg-card hover:border-muted-foreground/30 hover:shadow-sm cursor-pointer",
                            isSelected &&
                              "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/5 shadow-md shadow-emerald-500/10",
                          )}
                        >
                          {!isApproved && (
                            <div className="absolute top-3 right-3">
                              <Lock className="size-3.5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <p className="font-semibold text-sm flex-1 line-clamp-1">
                                {template.displayName}
                              </p>
                              {isSelected && (
                                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                                  <Check className="size-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="secondary" className="text-[10px] capitalize">
                                {template.category}
                              </Badge>
                              <Badge
                                variant={template.status === "approved" ? "default" : "secondary"}
                                className={cn(
                                  "text-[10px] capitalize",
                                  template.status === "approved" &&
                                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100",
                                )}
                              >
                                {template.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {template.body.text.slice(0, 100)}
                              {template.body.text.length > 100 ? "..." : ""}
                            </p>
                          </div>
                        </button>
                      </TooltipTrigger>
                      {!isApproved && (
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          Only approved templates can be used in campaigns. This template is
                          currently <strong>{template.status}</strong>.
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}
        </div>

        {/* Live preview panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Preview
            </p>
            {selectedTemplate ? (
              <>
                <TemplatePreview
                  header={selectedTemplate.header}
                  body={{
                    ...selectedTemplate.body,
                    examples: templateVars.map((v) => variables[v] || ""),
                  }}
                  footer={selectedTemplate.footer}
                  buttons={selectedTemplate.buttons}
                />

                {/* Variable mapping inputs */}
                {templateVars.length > 0 && (
                  <Card className="border-dashed">
                    <CardContent className="pt-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Template Variables
                      </p>
                      {templateVars.map((varName, i) => (
                        <div key={varName} className="space-y-1">
                          <Label className="text-xs font-medium">
                            {`{{${i + 1}}}`}{" "}
                            <span className="text-muted-foreground">— {varName}</span>
                          </Label>
                          <Input
                            placeholder={`e.g. ${varName}`}
                            className="h-8 text-xs"
                            value={variables[varName] ?? ""}
                            onChange={(e) => handleVarChange(varName, e.target.value)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                <FileText className="size-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No template selected</p>
                <p className="text-xs mt-1">Select a template to see a live preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Step 4: Review & Schedule
// ───────────────────────────────────────────────────────

function Step4ReviewSchedule({ form }: { form: ReturnType<typeof useForm<CreateCampaignInput>> }) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;
  const scheduleType = useWatch({ control: form.control, name: "scheduleType" });
  const scheduledAt = useWatch({ control: form.control, name: "scheduledAt" });
  const campaignName = useWatch({ control: form.control, name: "name" });
  const segmentId = useWatch({ control: form.control, name: "segmentId" });
  const templateId = useWatch({ control: form.control, name: "templateId" });
  const variables = useWatch({ control: form.control, name: "variables" }) ?? {};

  // Fetch segments & templates for display
  const { data: segmentsResult } = useQuery({
    queryKey: queryKeys.segments.list(),
    queryFn: fetchSegments,
  });
  const { data: templatesResult } = useQuery({
    queryKey: queryKeys.templates.list({}),
    queryFn: () => fetchTemplates({}),
  });

  const segments = segmentsResult?.data ?? [];
  const templates = templatesResult?.data ?? [];
  const selectedSegment = segments.find((s) => s.id === segmentId);
  const selectedTemplate = templates.find((t) => t.id === templateId);

  // Time state for the time picker
  const [timeValue, setTimeValue] = React.useState("12:00");

  const selectedDate = scheduledAt ? new Date(scheduledAt) : undefined;

  const handleDateSelect = React.useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const [hours, minutes] = timeValue.split(":").map(Number);
      date.setHours(hours ?? 12, minutes ?? 0, 0, 0);
      setValue("scheduledAt", date.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, timeValue],
  );

  const handleTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTimeValue(e.target.value);
      if (selectedDate) {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        const updated = new Date(selectedDate);
        updated.setHours(hours ?? 12, minutes ?? 0, 0, 0);
        setValue("scheduledAt", updated.toISOString(), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [selectedDate, setValue],
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-2">
          <ClipboardList className="size-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Review & Schedule</h2>
        <p className="text-sm text-muted-foreground">Verify everything looks good before sending</p>
      </div>

      {/* Summary card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {/* Campaign Name */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Megaphone className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Campaign
                </p>
                <p className="text-sm font-semibold truncate">
                  {campaignName || "Unnamed Campaign"}
                </p>
              </div>
            </div>

            {/* Audience */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                <Users className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Audience
                </p>
                <p className="text-sm font-semibold truncate">
                  {selectedSegment?.name ?? "No segment selected"}
                </p>
              </div>
              {selectedSegment && (
                <Badge variant="secondary" className="text-xs font-bold tabular-nums shrink-0">
                  {selectedSegment.estimatedCount.toLocaleString()} contacts
                </Badge>
              )}
            </div>

            {/* Template */}
            <div className="flex items-start gap-4 px-5 py-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">
                <FileText className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Template
                </p>
                <p className="text-sm font-semibold truncate">
                  {selectedTemplate?.displayName ?? "No template selected"}
                </p>
                {selectedTemplate && (
                  <div className="mt-3">
                    <TemplatePreview
                      header={selectedTemplate.header}
                      body={{
                        ...selectedTemplate.body,
                        examples:
                          selectedTemplate.body.variables?.map((v) => variables[v] || "") ?? [],
                      }}
                      footer={selectedTemplate.footer}
                      buttons={selectedTemplate.buttons}
                      className="!max-w-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Options */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">When to send?</Label>
        <div className="grid grid-cols-2 gap-3">
          {/* Send Now */}
          <button
            type="button"
            onClick={() =>
              setValue("scheduleType", "now", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
              scheduleType === "now"
                ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/5 shadow-md shadow-emerald-500/10"
                : "border-border/60 bg-card hover:border-muted-foreground/30",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  scheduleType === "now"
                    ? "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Rocket className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Send Now</p>
                <p className="text-xs text-muted-foreground">Broadcast immediately</p>
              </div>
            </div>
            <div
              className={cn(
                "absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border-2 transition-all",
                scheduleType === "now"
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/30",
              )}
            >
              {scheduleType === "now" && <Check className="size-3 stroke-[3]" />}
            </div>
          </button>

          {/* Schedule Later */}
          <button
            type="button"
            onClick={() =>
              setValue("scheduleType", "later", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
              scheduleType === "later"
                ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/5 shadow-md shadow-emerald-500/10"
                : "border-border/60 bg-card hover:border-muted-foreground/30",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  scheduleType === "later"
                    ? "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Clock className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Schedule</p>
                <p className="text-xs text-muted-foreground">Pick a date & time</p>
              </div>
            </div>
            <div
              className={cn(
                "absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border-2 transition-all",
                scheduleType === "later"
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/30",
              )}
            >
              {scheduleType === "later" && <Check className="size-3 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* DateTimePicker when schedule later */}
        {scheduleType === "later" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl border-2 border-dashed border-border bg-muted/20 space-y-3">
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal text-xs h-9",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <Clock className="mr-2 size-3.5" />
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                  className="w-[130px] h-9 text-xs"
                />
              </div>

              {selectedDate && (
                <p className="text-xs text-muted-foreground">
                  Campaign will be sent on{" "}
                  <span className="font-semibold text-foreground">
                    {selectedDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    at {timeValue}
                  </span>
                </p>
              )}

              {errors.scheduledAt && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="size-3" />
                  {errors.scheduledAt.message}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Main Campaign Wizard
// ───────────────────────────────────────────────────────

// The step schemas mapped by index, used for per-step validation
const stepSchemas = [
  campaignStep1Schema,
  campaignStep2Schema,
  campaignStep3Schema,
  campaignStep4Schema,
] as const;

// Fields belonging to each step
const stepFields: (keyof CreateCampaignInput)[][] = [
  ["name"],
  ["segmentId"],
  ["templateId", "variables"],
  ["scheduleType", "scheduledAt"],
];

export function CampaignWizard() {
  const router = useRouter();
  const { currentStep, setStep, wizardData, updateWizardData, resetWizard } =
    useCampaignWizardStore();

  const createCampaignMutation = useCreateCampaign();

  // Track slide direction for AnimatePresence
  const [direction, setDirection] = React.useState(0);

  const form = useForm<CreateCampaignInput>({
    resolver: zodResolver(campaignSchema) as Resolver<CreateCampaignInput>,
    mode: "onBlur",
    defaultValues: {
      name: (wizardData.name as string) ?? "",
      segmentId: (wizardData.segmentId as string) ?? "",
      templateId: (wizardData.templateId as string) ?? "",
      variables: (wizardData.variables as Record<string, string>) ?? {},
      scheduleType: (wizardData.scheduleType as "now" | "later") ?? "now",
      scheduledAt: (wizardData.scheduledAt as string) ?? "",
    },
  });

  // Reset wizard data on mount
  React.useEffect(() => {
    resetWizard();
    form.reset({
      name: "",
      segmentId: "",
      templateId: "",
      variables: {},
      scheduleType: "now",
      scheduledAt: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Validate current step fields, persist to store, advance
   */
  const handleNext = async () => {
    const fields = stepFields[currentStep];
    if (!fields) return;

    // Trigger validation only for current step's fields
    const isValid = await form.trigger(fields);
    if (!isValid) return;

    // Persist current values to zustand store
    const vals = form.getValues();
    const stepData: Partial<CreateCampaignInput> = {};
    for (const field of fields) {
      // @ts-expect-error dynamic field assignment
      stepData[field] = vals[field];
    }
    updateWizardData(stepData);

    setDirection(1);
    setStep(currentStep + 1);
  };

  const handleBack = () => {
    // Persist current data before going back
    const vals = form.getValues();
    const fields = stepFields[currentStep];
    if (fields) {
      const stepData: Partial<CreateCampaignInput> = {};
      for (const field of fields) {
        // @ts-expect-error dynamic field assignment
        stepData[field] = vals[field];
      }
      updateWizardData(stepData);
    }

    setDirection(-1);
    setStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validate entire form
    const fields = stepFields[3]!;
    const isValid = await form.trigger(fields);
    if (!isValid) return;

    const vals = form.getValues();

    try {
      const result = await createCampaignMutation.mutateAsync({
        name: vals.name,
        segmentId: vals.segmentId,
        templateId: vals.templateId,
        variables: vals.variables ?? {},
        scheduleType: vals.scheduleType,
        scheduledAt: vals.scheduleType === "later" ? vals.scheduledAt : undefined,
      });

      resetWizard();
      router.push(`/campaigns/${result.data.id}`);
    } catch {
      // Error handled by mutation onError
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const scheduleType = form.watch("scheduleType");

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Top bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <WizardStepper currentStep={currentStep} />
        </div>
      </div>

      {/* Step content with AnimatePresence */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={motionConfig.wizardStep}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionConfig.wizardStep.transition}
            >
              {currentStep === 0 && <Step1CampaignName form={form} />}
              {currentStep === 1 && <Step2SelectAudience form={form} />}
              {currentStep === 2 && <Step3SelectTemplate form={form} />}
              {currentStep === 3 && <Step4ReviewSchedule form={form} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t bg-card/80 backdrop-blur-sm sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
              onClick={() => router.push("/campaigns")}
            >
              <X className="size-3.5" />
              Cancel
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={handleBack}
              >
                <ArrowLeft className="size-3.5" />
                Back
              </Button>
            )}

            {!isLastStep ? (
              <Button
                type="button"
                size="sm"
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs min-w-[100px]"
                onClick={handleNext}
              >
                Next
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={createCampaignMutation.isPending}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs min-w-[140px]"
                onClick={handleSubmit}
              >
                {createCampaignMutation.isPending ? (
                  <>
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : scheduleType === "later" ? (
                  <>
                    <Clock className="size-3.5" />
                    Schedule Campaign
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Send Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
