import { ApiResponse, DashboardMetrics } from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches high-level executive dashboard metrics including message volume,
 * delivery funnel, response time percentiles, and top campaigns.
 */
export async function fetchDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
  await delay(200, 600);
  return {
    data: { ...mockStore.dashboard },
    success: true,
  };
}
