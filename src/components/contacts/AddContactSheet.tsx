"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { queryKeys, createContact, fetchAgents, fetchTags } from "@/lib/api";
import { CreateContactInput, Tag } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/crm/TagInput";

export interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const addContactSchema = z.object({
  name: z
    .string({ message: "Contact name is required" })
    .trim()
    .min(1, "Contact name cannot be empty")
    .max(100, "Contact name cannot exceed 100 characters"),

  phone: z
    .string({ message: "Phone number is required" })
    .trim()
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Phone number must be in valid E.164 international format (e.g. +919876543210)",
    ),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),

  assignedAgentId: z.string().optional(),
});

type AddContactFormValues = z.infer<typeof addContactSchema>;

export function AddContactSheet({ open, onOpenChange }: AddContactSheetProps) {
  const queryClient = useQueryClient();

  const { data: agentsData } = useQuery({
    queryKey: queryKeys.agents.list(),
    queryFn: () => fetchAgents(),
  });
  const agents = agentsData?.data || [];

  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: () => fetchTags(),
  });
  const availableTags = tagsData?.data || [];

  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddContactFormValues>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      name: "",
      phone: "+91",
      email: "",
      assignedAgentId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateContactInput) => createContact(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toast.success(`Contact ${res.data.name} created successfully`);
      reset();
      setSelectedTags([]);
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create contact");
    },
  });

  const onSubmit = (values: AddContactFormValues) => {
    createMutation.mutate({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      assignedAgentId: values.assignedAgentId,
      tags: selectedTags.map((t) => t.id),
      optInStatus: true,
      customAttributes: {},
    });
  };

  const handleAddTag = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId);
    if (tag && !selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 text-foreground">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserPlus className="size-4" />
            </div>
            <SheetTitle className="text-base font-bold">Add New Contact</SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Create a new WhatsApp customer record with international phone format.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col justify-between overflow-y-auto"
        >
          <div className="p-6 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs font-semibold">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-name"
                {...register("name")}
                placeholder="e.g. Rahul Sharma"
                className="h-9 text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone" className="text-xs font-semibold">
                WhatsApp Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-phone"
                {...register("phone")}
                placeholder="+919876543210"
                className="h-9 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Must include country code in E.164 format (e.g. +91 98765 43210).
              </p>
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs font-semibold">
                Email Address <span className="text-muted-foreground text-[10px]">(Optional)</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                {...register("email")}
                placeholder="rahul@example.com"
                className="h-9 text-xs"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Assigned Agent */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assigned Agent</Label>
              <Controller
                control={control}
                name="assignedAgentId"
                render={({ field }) => (
                  <Select
                    value={field.value || "unassigned"}
                    onValueChange={(val) => field.onChange(val === "unassigned" ? undefined : val)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Assign support agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" className="text-xs">
                        Unassigned
                      </SelectItem>
                      {agents.map((ag) => (
                        <SelectItem key={ag.id} value={ag.id} className="text-xs">
                          {ag.name} ({ag.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tags</Label>
              <TagInput
                tags={selectedTags}
                availableTags={availableTags}
                onAdd={handleAddTag}
                onRemove={handleRemoveTag}
              />
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-border bg-muted/10 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Save Contact</span>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
