"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
  AlertCircle,
  Code,
  Bold,
  Italic,
  Strikethrough,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import { templateSchema, type CreateTemplateInput } from "@/lib/validators/template";
import { Template, TemplateCategory, TemplateHeaderType, TemplateButtonType } from "@/lib/types";
import { useCreateTemplate, useUpdateTemplate } from "@/lib/hooks";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplatePreview } from "@/components/crm/TemplatePreview";

export interface TemplateBuilderProps {
  initialData?: Template;
  mode?: "create" | "edit";
}

const LANGUAGE_OPTIONS = [
  { value: "en_US", label: "English (US)" },
  { value: "en_GB", label: "English (UK)" },
  { value: "hi", label: "Hindi (hi)" },
  { value: "es", label: "Spanish (es)" },
  { value: "pt_BR", label: "Portuguese (BR)" },
  { value: "fr", label: "French (fr)" },
  { value: "de", label: "German (de)" },
  { value: "ar", label: "Arabic (ar)" },
];

export function TemplateBuilder({ initialData, mode = "create" }: TemplateBuilderProps) {
  const router = useRouter();

  // Collapsible section state
  const [headerOpen, setHeaderOpen] = React.useState(
    Boolean(initialData?.header && initialData.header.type !== "none"),
  );
  const [footerOpen, setFooterOpen] = React.useState(Boolean(initialData?.footer?.text));
  const [buttonsOpen, setButtonsOpen] = React.useState(
    Boolean(initialData?.buttons && initialData.buttons.length > 0),
  );

  // Target status for form submission (draft vs pending)
  const [submitStatus, setSubmitStatus] = React.useState<"draft" | "pending">("draft");

  // Mutations
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // React Hook Form
  const form = useForm<CreateTemplateInput>({
    resolver: zodResolver(templateSchema) as Resolver<CreateTemplateInput>,
    mode: "onBlur",
    defaultValues: {
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      category: initialData?.category || "marketing",
      language: initialData?.language || "en_US",
      header: {
        type: initialData?.header?.type || "none",
        text: initialData?.header?.text || "",
        mediaUrl: initialData?.header?.mediaUrl || "",
      },
      body: {
        text: initialData?.body?.text || "",
        examples: initialData?.body?.examples || [],
      },
      footer: {
        text: initialData?.footer?.text || "",
      },
      buttons:
        initialData?.buttons?.map((b) => ({
          type: b.type,
          text: b.text,
          url: b.url || "",
          phoneNumber: b.phoneNumber || "",
        })) || [],
    },
  });

  const { control, setValue, getValues, handleSubmit } = form;

  // Field Array for Buttons
  const { fields, append, remove } = useFieldArray({
    control,
    name: "buttons",
  });

  // Watch values for real-time live preview with debouncing
  const watchedValues = form.watch();
  const [debouncedValues, setDebouncedValues] = React.useState(watchedValues);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(watchedValues);
    }, 80);
    return () => clearTimeout(timer);
  }, [watchedValues]);

  // Auto-detect variables in body text: {{1}}, {{2}}, etc.
  const bodyText = watchedValues.body?.text || "";
  const detectedVariables = React.useMemo(() => {
    const matches = bodyText.matchAll(/\{\{(\d+)\}\}/g);
    const nums = new Set<number>();
    for (const m of matches) {
      if (m[1]) nums.add(parseInt(m[1], 10));
    }
    return Array.from(nums).sort((a, b) => a - b);
  }, [bodyText]);

  // Handle inserting variable {{N}} into body textarea
  const handleInsertVariable = (varNum: number) => {
    const current = getValues("body.text") || "";
    const placeholder = `{{${varNum}}}`;
    setValue("body.text", `${current}${current ? " " : ""}${placeholder}`, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Next available variable number
  const nextVarNum = detectedVariables.length > 0 ? Math.max(...detectedVariables) + 1 : 1;

  // Formatting hint insertion
  const handleInsertFormatting = (prefix: string, suffix: string) => {
    const current = getValues("body.text") || "";
    setValue("body.text", `${current}${prefix}text${suffix}`, {
      shouldDirty: true,
    });
  };

  // Example value change for detected variable
  const handleExampleChange = (varNum: number, value: string) => {
    const currentExamples = [...(getValues("body.examples") || [])];
    const index = varNum - 1;
    currentExamples[index] = value;
    setValue("body.examples", currentExamples, {
      shouldDirty: true,
    });
  };

  // Submission handler
  const onSubmit = async (values: CreateTemplateInput) => {
    try {
      const payload: CreateTemplateInput & { status: "draft" | "pending" } = {
        ...values,
        status: submitStatus,
      };

      if (mode === "edit" && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      router.push("/templates");
    } catch {
      // Error handled in mutation onError
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/templates")}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Templates</span>
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {mode === "edit" ? "Edit Mode" : "New Template"}
          </Badge>
        </div>
      </div>

      {/* Main Grid: Form (60%) | Live Preview (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Basic Info */}
              <Card className="border-border shadow-2xs">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>1. Basic Information</span>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      Required
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Identifier (snake_case) */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Template Identifier</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={mode === "edit"}
                            placeholder="e.g. order_delivery_update"
                            onChange={(e) => {
                              const formatted = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_]/g, "_");
                              field.onChange(formatted);
                            }}
                            className="font-mono text-xs"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px]">
                          Lowercase alphanumeric with underscores. Used as the API identifier.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Display Name */}
                  <FormField
                    control={control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Display Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Order Delivery Update"
                            className="text-xs"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px]">
                          Human-readable name displayed across your CRM dashboard.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Category & Language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <FormField
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="marketing" className="text-xs">
                                Marketing
                              </SelectItem>
                              <SelectItem value="utility" className="text-xs">
                                Utility
                              </SelectItem>
                              <SelectItem value="authentication" className="text-xs">
                                Authentication
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Language */}
                    <FormField
                      control={control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LANGUAGE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Header (Collapsible, Optional) */}
              <Card className="border-border shadow-2xs">
                <CardHeader
                  className="pb-4 cursor-pointer select-none"
                  onClick={() => setHeaderOpen(!headerOpen)}
                >
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>2. Header</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground font-normal"
                      >
                        Optional
                      </Badge>
                    </div>
                    {headerOpen ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>

                {headerOpen && (
                  <CardContent className="space-y-4 pt-0 animate-in fade-in-50 duration-200">
                    {/* Header Type */}
                    <FormField
                      control={control}
                      name="header.type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Header Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Header type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none" className="text-xs">
                                None
                              </SelectItem>
                              <SelectItem value="text" className="text-xs">
                                Text
                              </SelectItem>
                              <SelectItem value="image" className="text-xs">
                                Image
                              </SelectItem>
                              <SelectItem value="video" className="text-xs">
                                Video
                              </SelectItem>
                              <SelectItem value="document" className="text-xs">
                                Document
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Text Header Input */}
                    {watchedValues.header?.type === "text" && (
                      <FormField
                        control={control}
                        name="header.text"
                        render={({ field }) => {
                          const len = (field.value || "").length;
                          return (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-xs font-semibold">Header Text</FormLabel>
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  {len}/60
                                </span>
                              </div>
                              <FormControl>
                                <Input
                                  {...field}
                                  maxLength={60}
                                  placeholder="e.g. Order #{{1}} Confirmed"
                                  className="text-xs"
                                />
                              </FormControl>
                              <FormDescription className="text-[11px]">
                                WhatsApp supports at most one variable in the header (e.g. {"{{1}}"}
                                ).
                              </FormDescription>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                    )}

                    {/* Media Header Input */}
                    {["image", "video", "document"].includes(watchedValues.header?.type || "") && (
                      <FormField
                        control={control}
                        name="header.mediaUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">
                              Sample Media URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://example.com/sample-media.jpg"
                                className="text-xs font-mono"
                              />
                            </FormControl>
                            <FormDescription className="text-[11px]">
                              Provide a sample public media link for Meta template review.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Section 3: Body (Required) */}
              <Card className="border-border shadow-2xs">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>3. Body Message</span>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      Required
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Formatting tools & Variable insertion bar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInsertVariable(nextVarNum)}
                        className="h-7 text-xs gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <Plus className="size-3" />
                        <span>Insert {`{{${nextVarNum}}}`}</span>
                      </Button>

                      {detectedVariables.length > 0 && (
                        <div className="flex items-center gap-1">
                          {detectedVariables.map((v) => (
                            <Badge key={v} variant="secondary" className="text-[10px] font-mono">
                              {`{{${v}}}`}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Markdown Quick Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Bold (*text*)"
                        onClick={() => handleInsertFormatting("*", "*")}
                      >
                        <Bold className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Italic (_text_)"
                        onClick={() => handleInsertFormatting("_", "_")}
                      >
                        <Italic className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Strikethrough (~text~)"
                        onClick={() => handleInsertFormatting("~", "~")}
                      >
                        <Strikethrough className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Body Textarea */}
                  <FormField
                    control={control}
                    name="body.text"
                    render={({ field }) => {
                      const len = (field.value || "").length;
                      return (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-semibold">Message Content</FormLabel>
                            <span
                              className={cn(
                                "text-[11px] font-mono",
                                len > 1024 ? "text-destructive font-bold" : "text-muted-foreground",
                              )}
                            >
                              {len}/1024
                            </span>
                          </div>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              maxLength={1024}
                              placeholder="Hello {{1}}, thank you for your order #{{2}}! We have dispatched your package..."
                              className="text-xs font-sans leading-relaxed resize-y"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Example values for detected variables */}
                  {detectedVariables.length > 0 && (
                    <div className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Sparkles className="size-3.5 text-emerald-500" />
                        <span>Variable Example Values</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Meta requires example values for review to understand how your template will
                        appear.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {detectedVariables.map((v) => {
                          const currentVal = getValues(`body.examples.${v - 1}`) || "";
                          return (
                            <div key={v} className="space-y-1">
                              <label className="text-[11px] font-mono font-medium text-muted-foreground">
                                {`{{${v}}}`} sample
                              </label>
                              <Input
                                value={currentVal}
                                onChange={(e) => handleExampleChange(v, e.target.value)}
                                placeholder={`e.g. Sample ${v}`}
                                className="h-8 text-xs bg-background"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section 4: Footer (Collapsible, Optional) */}
              <Card className="border-border shadow-2xs">
                <CardHeader
                  className="pb-4 cursor-pointer select-none"
                  onClick={() => setFooterOpen(!footerOpen)}
                >
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>4. Footer</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground font-normal"
                      >
                        Optional
                      </Badge>
                    </div>
                    {footerOpen ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>

                {footerOpen && (
                  <CardContent className="space-y-4 pt-0 animate-in fade-in-50 duration-200">
                    <FormField
                      control={control}
                      name="footer.text"
                      render={({ field }) => {
                        const len = (field.value || "").length;
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-xs font-semibold">Footer Text</FormLabel>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {len}/60
                              </span>
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                maxLength={60}
                                placeholder="e.g. Not interested? Reply STOP to opt out"
                                className="text-xs"
                              />
                            </FormControl>
                            <FormDescription className="text-[11px]">
                              Short disclaimer or opt-out instructions at the bottom of the message.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        );
                      }}
                    />
                  </CardContent>
                )}
              </Card>

              {/* Section 5: Buttons (Collapsible, Optional) */}
              <Card className="border-border shadow-2xs">
                <CardHeader
                  className="pb-4 cursor-pointer select-none"
                  onClick={() => setButtonsOpen(!buttonsOpen)}
                >
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>5. Action Buttons</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground font-normal"
                      >
                        {fields.length}/3 Added
                      </Badge>
                    </div>
                    {buttonsOpen ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>

                {buttonsOpen && (
                  <CardContent className="space-y-4 pt-0 animate-in fade-in-50 duration-200">
                    {fields.length === 0 ? (
                      <div className="text-center py-4 border border-dashed rounded-lg border-border">
                        <p className="text-xs text-muted-foreground">
                          No buttons configured. You can add up to 3 interactive buttons.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {fields.map((fieldItem, index) => {
                          const buttonType = watchedValues.buttons?.[index]?.type || "quick_reply";

                          return (
                            <div
                              key={fieldItem.id}
                              className="rounded-lg border border-border bg-muted/20 p-3 space-y-3 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-foreground">
                                  Button #{index + 1}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="size-6 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Button Type */}
                                <FormField
                                  control={control}
                                  name={`buttons.${index}.type`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px]">Type</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="quick_reply" className="text-xs">
                                            Quick Reply
                                          </SelectItem>
                                          <SelectItem value="url" className="text-xs">
                                            Visit Website (URL)
                                          </SelectItem>
                                          <SelectItem value="phone" className="text-xs">
                                            Call Phone
                                          </SelectItem>
                                          <SelectItem value="copy_code" className="text-xs">
                                            Copy Code
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />

                                {/* Button Label */}
                                <FormField
                                  control={control}
                                  name={`buttons.${index}.text`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex items-center justify-between">
                                        <FormLabel className="text-[11px]">Label</FormLabel>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                          {(field.value || "").length}/25
                                        </span>
                                      </div>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          maxLength={25}
                                          placeholder="e.g. Track Order"
                                          className="h-8 text-xs"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Conditional URL Field */}
                              {buttonType === "url" && (
                                <FormField
                                  control={control}
                                  name={`buttons.${index}.url`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px]">Website URL</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="https://example.com/track"
                                          className="h-8 text-xs font-mono"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              )}

                              {/* Conditional Phone Field */}
                              {buttonType === "phone" && (
                                <FormField
                                  control={control}
                                  name={`buttons.${index}.phoneNumber`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px]">
                                        Phone Number (with country code)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="+15551234567"
                                          className="h-8 text-xs font-mono"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Button Action */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={fields.length >= 3}
                      onClick={() =>
                        append({
                          type: "quick_reply",
                          text: "",
                          url: "",
                          phoneNumber: "",
                        })
                      }
                      className="w-full text-xs gap-1 border-dashed"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Button {fields.length >= 3 ? "(Max 3 reached)" : ""}</span>
                    </Button>
                  </CardContent>
                )}
              </Card>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/templates")}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setSubmitStatus("draft")}
                  className="text-xs"
                >
                  {isSubmitting && submitStatus === "draft" && (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  )}
                  Save as Draft
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setSubmitStatus("pending")}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-xs"
                >
                  {isSubmitting && submitStatus === "pending" && (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  )}
                  Submit for Review
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Sticky Live Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">WhatsApp Live Preview</span>
              <Badge variant="outline" className="text-[10px] font-normal capitalize">
                {debouncedValues.category || "marketing"}
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground uppercase font-mono">
              {debouncedValues.language || "en_US"}
            </span>
          </div>

          {/* WhatsApp Message Card Preview */}
          <TemplatePreview
            header={debouncedValues.header}
            body={debouncedValues.body || { text: "" }}
            footer={debouncedValues.footer}
            buttons={debouncedValues.buttons}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
