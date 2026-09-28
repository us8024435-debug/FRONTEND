"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryKeys, createAgent } from "@/lib/api";
import type { Agent, AgentRole, ApiResponse } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ───────────────────────────────────────────────────────
// Zod Schema
// ───────────────────────────────────────────────────────

const addAgentSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(["admin", "manager", "agent"], {
    message: "Please select a role",
  }),
  departments: z.array(z.string()).default([]),
  maxConversations: z.coerce
    .number()
    .int()
    .min(1, "Must be at least 1")
    .max(100, "Cannot exceed 100")
    .default(20),
});

type AddAgentInput = z.infer<typeof addAgentSchema>;

// ───────────────────────────────────────────────────────
// Available departments for multi-select
// ───────────────────────────────────────────────────────

const AVAILABLE_DEPARTMENTS = [
  "Sales",
  "Support",
  "Customer Success",
  "Onboarding",
  "Technical Support",
  "Enterprise",
  "Operations",
  "Executive",
];

// ───────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────

export interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAgentDialog({ open, onOpenChange }: AddAgentDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddAgentInput>({
    resolver: zodResolver(addAgentSchema) as Resolver<AddAgentInput>,
    defaultValues: {
      name: "",
      email: "",
      role: "agent",
      departments: [],
      maxConversations: 20,
    },
  });

  const selectedDepts = watch("departments");

  const createMutation = useMutation<ApiResponse<Agent>, Error, AddAgentInput>({
    mutationFn: (data) =>
      createAgent({
        name: data.name,
        email: data.email,
        role: data.role as AgentRole,
        departments: data.departments,
        maxConversations: data.maxConversations,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all });
      toast.success(`Agent "${res.data.name}" added successfully`);
      reset();
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add agent");
    },
  });

  const onSubmit = (data: AddAgentInput) => {
    createMutation.mutate(data);
  };

  const toggleDept = (dept: string) => {
    const current = selectedDepts ?? [];
    if (current.includes(dept)) {
      setValue(
        "departments",
        current.filter((d) => d !== dept),
        { shouldDirty: true },
      );
    } else {
      setValue("departments", [...current, dept], { shouldDirty: true });
    }
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-bold">Add New Agent</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a new team member to handle conversations and campaigns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="agent-name" className="text-xs font-semibold">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agent-name"
              placeholder="e.g. Priya Sharma"
              className="h-9 text-sm"
              {...register("name")}
            />
            {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="agent-email" className="text-xs font-semibold">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agent-email"
              type="email"
              placeholder="e.g. priya@mindclub.org"
              className="h-9 text-sm"
              {...register("email")}
            />
            {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              defaultValue="agent"
              onValueChange={(v) =>
                setValue("role", v as AddAgentInput["role"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" className="text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-violet-500" />
                    Admin
                  </span>
                </SelectItem>
                <SelectItem value="manager" className="text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    Manager
                  </span>
                </SelectItem>
                <SelectItem value="agent" className="text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-gray-400" />
                    Agent
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-[11px] text-red-500">{errors.role.message}</p>}
          </div>

          {/* Departments multi-select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Departments</Label>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-border bg-muted/20 min-h-[38px]">
              {AVAILABLE_DEPARTMENTS.map((dept) => {
                const isSelected = (selectedDepts ?? []).includes(dept);
                return (
                  <Badge
                    key={dept}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "text-[10px] cursor-pointer transition-all select-none py-0.5",
                      isSelected
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        : "hover:bg-muted",
                    )}
                    onClick={() => toggleDept(dept)}
                  >
                    {isSelected && <span className="mr-0.5">✓</span>}
                    {dept}
                  </Badge>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Click to toggle department assignment
            </p>
          </div>

          {/* Max Conversations */}
          <div className="space-y-1.5">
            <Label htmlFor="agent-max-conversations" className="text-xs font-semibold">
              Max Conversations
            </Label>
            <Input
              id="agent-max-conversations"
              type="number"
              min={1}
              max={100}
              className="h-9 text-sm w-32"
              {...register("maxConversations")}
            />
            {errors.maxConversations && (
              <p className="text-[11px] text-red-500">{errors.maxConversations.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 min-w-[100px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add Agent"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
