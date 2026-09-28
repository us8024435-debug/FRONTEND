"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, createTemplate, updateTemplate } from "@/lib/api";
import { CreateTemplateInput, UpdateTemplateInput, ApiResponse, Template } from "@/lib/types";

/**
 * Custom hook wrapping createTemplate mutation with cache invalidation
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Template>, Error, CreateTemplateInput>({
    mutationFn: (data: CreateTemplateInput) => createTemplate(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.templates.all,
      });
      toast.success(`Template "${res.data.displayName}" created successfully`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create template");
    },
  });
}

/**
 * Custom hook wrapping updateTemplate mutation with cache invalidation
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Template>, Error, { id: string; data: UpdateTemplateInput }>({
    mutationFn: ({ id, data }) => updateTemplate(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.templates.all,
      });
      toast.success(`Template "${res.data.displayName}" updated successfully`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update template");
    },
  });
}
