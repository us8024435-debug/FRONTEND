"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, createContact } from "@/lib/api";
import { CreateContactInput, ApiResponse, Contact } from "@/lib/types";

/**
 * Custom hook wrapping createContact mutation with cache invalidation and toast notifications.
 */
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Contact>, Error, CreateContactInput>({
    mutationFn: (data: CreateContactInput) => createContact(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.lists(),
      });
      toast.success(`Contact ${res.data.name} created successfully`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create contact");
    },
  });
}
