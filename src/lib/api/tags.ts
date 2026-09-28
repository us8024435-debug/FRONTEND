import { Tag, ApiResponse } from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches all available CRM tags
 */
export async function fetchTags(): Promise<ApiResponse<Tag[]>> {
  await delay(200, 600);
  return {
    data: [...mockStore.tags],
    success: true,
  };
}
