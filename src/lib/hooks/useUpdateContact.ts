"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, updateContact } from "@/lib/api";
import { UpdateContactInput, ApiResponse, Contact } from "@/lib/types";

export interface UpdateContactVariables {
  id: string;
  data: UpdateContactInput;
}

/**
 * Custom hook wrapping updateContact mutation with cache invalidation for details and lists.
 */
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Contact>, Error, UpdateContactVariables>({
    mutationFn: ({ id, data }: UpdateContactVariables) => updateContact(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.lists(),
      });
      toast.success(`Contact ${res.data.name} updated successfully`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update contact");
    },
  });
}
