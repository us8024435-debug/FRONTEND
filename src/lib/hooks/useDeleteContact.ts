"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, deleteContact } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

/**
 * Custom hook wrapping deleteContact mutation with cache invalidation and toast notifications.
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.lists(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.contacts.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
      toast.success("Contact deleted successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete contact");
    },
  });
}
