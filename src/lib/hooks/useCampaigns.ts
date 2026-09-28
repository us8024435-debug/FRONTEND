"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, createCampaign } from "@/lib/api";
import { CreateCampaignInput, ApiResponse, Campaign } from "@/lib/types";

/**
 * Custom hook wrapping createCampaign mutation with cache invalidation
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Campaign>, Error, CreateCampaignInput>({
    mutationFn: (data: CreateCampaignInput) => createCampaign(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.all,
      });
      toast.success(`Campaign "${res.data.name}" created successfully`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
    },
  });
}
