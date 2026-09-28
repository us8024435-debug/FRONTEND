"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserPlus, UserCheck, Plus, Trash2, AlertCircle, HelpCircle } from "lucide-react";
import { queryKeys, fetchTags } from "@/lib/api";
import { useCreateContact, useUpdateContact } from "@/lib/hooks";
import { Contact, Tag } from "@/lib/types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/crm/TagInput";

export interface ContactFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact;
  onSuccess?: () => void;
}

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Contact name is required")
    .max(100, "Contact name cannot exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, "Phone must be in valid E.164 format (e.g. +919876543210)"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),

  optInStatus: z.boolean(),

  tags: z.array(z.custom<Tag>()),
  customAttributes: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    }),
  ),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactFormSheet({
  open,
  onOpenChange,
  contact,
  onSuccess,
}: ContactFormSheetProps) {
  const isEditing = Boolean(contact);

  // Mutations
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();

  const isSubmitting = createContactMutation.isPending || updateContactMutation.isPending;

  // Available Tags
  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: () => fetchTags(),
  });
  const availableTags = tagsData?.data || [];

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "+91",
      email: "",
      optInStatus: true,
      tags: [],
      customAttributes: [],
    },
  });

  const selectedTags = watch("tags") || [];

  // Dynamic Custom Attributes with useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customAttributes",
  });

  // Pre-fill form when editing or resetting for add
  React.useEffect(() => {
    if (contact) {
      const customAttrs = Object.entries(contact.customAttributes || {}).map(([key, value]) => ({
        key,
        value: String(value),
      }));

      reset({
        name: contact.name || "",
        phone: contact.phone || "+91",
        email: contact.email || "",
        optInStatus: contact.optInStatus ?? true,
        tags: contact.tags || [],
        customAttributes: customAttrs,
      });
    } else {
      reset({
        name: "",
        phone: "+91",
        email: "",
        optInStatus: true,
        tags: [],
        customAttributes: [],
      });
    }
  }, [contact, reset]);

  const handleAddTag = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId);
    if (tag && !selectedTags.some((t) => t.id === tag.id)) {
      setValue("tags", [...selectedTags, tag], { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setValue(
      "tags",
      selectedTags.filter((t) => t.id !== tagId),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (values: ContactFormValues) => {
    // Convert customAttributes array to record
    const customAttrsRecord: Record<string, string> = {};
    values.customAttributes.forEach((item) => {
      if (item.key.trim()) {
        customAttrsRecord[item.key.trim()] = item.value;
      }
    });

    const payload = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      optInStatus: values.optInStatus,
      tags: (values.tags || []).map((t) => t.id),
      customAttributes: customAttrsRecord,
    };

    try {
      if (contact) {
        await updateContactMutation.mutateAsync({
          id: contact.id,
          data: payload,
        });
      } else {
        await createContactMutation.mutateAsync(payload);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Handled by mutation hook's onError toast
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] flex flex-col p-0 border-l border-border bg-card shadow-xl"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 text-foreground">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              {isEditing ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
            </div>
            <SheetTitle className="text-base font-bold text-foreground">
              {isEditing ? "Edit Contact" : "Add Contact"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            {isEditing
              ? `Update contact details and preferences for ${contact?.name}.`
              : "Create a new contact with phone number and optional custom attributes."}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col justify-between overflow-y-auto chat-scrollbar"
        >
          <div className="p-6 space-y-5">
            {/* Form-level error summary if >2 errors */}
            {errorCount > 2 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-xs space-y-1.5 animate-in fade-in duration-150">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>Please resolve the {errorCount} errors below:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1 opacity-90">
                  {Object.entries(errors).map(([key, err]) => (
                    <li key={key}>{err?.message?.toString() || `Invalid ${key}`}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 1. Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs font-semibold">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-name"
                {...register("name")}
                disabled={isSubmitting}
                placeholder="e.g. Priya Sharma"
                className="h-9 text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* 2. Phone Number with prefix hint */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="contact-phone" className="text-xs font-semibold">
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  E.164 (e.g. +91 98765 43210)
                </span>
              </div>
              <Input
                id="contact-phone"
                {...register("phone")}
                disabled={isSubmitting}
                placeholder="+919876543210"
                className="h-9 text-xs font-mono"
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* 3. Email */}
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs font-semibold">
                Email Address <span className="text-[10px] text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                {...register("email")}
                disabled={isSubmitting}
                placeholder="priya@example.com"
                className="h-9 text-xs"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* 4. Tags Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tags</Label>
              <TagInput
                tags={selectedTags}
                availableTags={availableTags}
                onAdd={handleAddTag}
                onRemove={handleRemoveTag}
              />
            </div>

            {/* 5. Opt-in Status Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
              <div className="space-y-0.5 pr-2">
                <Label
                  htmlFor="opt-in-switch"
                  className="text-xs font-semibold cursor-pointer text-foreground"
                >
                  WhatsApp Opt-in Status
                </Label>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Customer has consented to receive outbound WhatsApp business messages.
                </p>
              </div>
              <Controller
                control={control}
                name="optInStatus"
                render={({ field }) => (
                  <Switch
                    id="opt-in-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* 6. Dynamic Custom Attributes (useFieldArray) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Label className="text-xs font-semibold">Custom Attributes</Label>
                  <span
                    className="cursor-help text-muted-foreground"
                    title="Key-value pairs for metadata like Plan, Company, City, or Account ID."
                  >
                    <HelpCircle className="size-3" />
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ key: "", value: "" })}
                  disabled={isSubmitting}
                  className="h-7 text-xs gap-1 border-dashed"
                >
                  <Plus className="size-3" />
                  <span>Add attribute</span>
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-[11px] text-muted-foreground italic py-2 text-center border border-dashed rounded-md bg-muted/10">
                  No custom attributes added. Click &ldquo;Add attribute&rdquo; to add metadata.
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...register(`customAttributes.${index}.key` as const)}
                        disabled={isSubmitting}
                        placeholder="Key (e.g. Plan)"
                        className="h-8 text-xs flex-1"
                      />
                      <Input
                        {...register(`customAttributes.${index}.value` as const)}
                        disabled={isSubmitting}
                        placeholder="Value (e.g. Enterprise)"
                        className="h-8 text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                        className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                        title="Remove attribute"
                        aria-label="Remove attribute"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <SheetFooter className="p-6 border-t border-border bg-muted/10 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{isEditing ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <span>{isEditing ? "Update Contact" : "Save Contact"}</span>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
