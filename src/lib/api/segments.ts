import { Segment, SegmentFilter, ApiResponse } from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches all dynamic audience segments
 */
export async function fetchSegments(): Promise<ApiResponse<Segment[]>> {
  await delay(200, 600);
  return {
    data: [...mockStore.segments],
    success: true,
  };
}

/**
 * Estimates audience reach for a set of segment filter criteria
 * Returns a simulated count between 100 and 5,000
 */
export async function estimateAudienceCount(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _filters: SegmentFilter[],
): Promise<ApiResponse<{ count: number }>> {
  await delay(200, 600);
  const min = 100;
  const max = 5000;
  const count = Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    data: { count },
    success: true,
  };
}
