import {
  Campaign,
  CampaignFilters,
  CreateCampaignInput,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches broadcast campaigns with status and search filters
 */
export async function fetchCampaigns(
  filters?: CampaignFilters,
): Promise<PaginatedResponse<Campaign>> {
  await delay(200, 600);

  let items = [...mockStore.campaigns];

  if (filters?.status) {
    items = items.filter((c) => c.status === filters.status);
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    items = items.filter((c) => c.name.toLowerCase().includes(q));
  }

  if (filters?.dateRange?.from) {
    items = items.filter((c) => c.createdAt >= filters.dateRange!.from);
  }
  if (filters?.dateRange?.to) {
    items = items.filter((c) => c.createdAt <= filters.dateRange!.to);
  }

  return {
    data: items,
    pagination: {
      page: 1,
      pageSize: items.length,
      total: items.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

/**
 * Fetches a single campaign by ID
 */
export async function fetchCampaign(id: string): Promise<ApiResponse<Campaign>> {
  await delay(200, 600);
  const campaign = mockStore.campaigns.find((c) => c.id === id);

  if (!campaign) {
    throw new Error(`Campaign with ID ${id} not found`);
  }

  return {
    data: { ...campaign },
    success: true,
  };
}

/**
 * Creates a new broadcast campaign
 */
export async function createCampaign(data: CreateCampaignInput): Promise<ApiResponse<Campaign>> {
  await delay(200, 600);
  const now = new Date().toISOString();
  const nextNum = mockStore.campaigns.length + 1;
  const newId = `campaign_${String(nextNum).padStart(3, "0")}`;

  const template = mockStore.templates.find((t) => t.id === data.templateId);
  const segment = data.segmentId
    ? mockStore.segments.find((s) => s.id === data.segmentId)
    : undefined;
  const audienceCount = segment ? segment.estimatedCount : 500;

  const isScheduled = data.scheduleType === "later" && data.scheduledAt;

  const newCampaign: Campaign = {
    id: newId,
    name: data.name,
    status: isScheduled ? "scheduled" : "draft",
    templateId: data.templateId,
    template,
    segmentId: data.segmentId,
    segment,
    audienceCount,
    scheduledAt: isScheduled ? data.scheduledAt : undefined,
    stats: {
      total: audienceCount,
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      failed: 0,
      clicked: 0,
    },
    createdById: "agent_001",
    createdAt: now,
    updatedAt: now,
  };

  mockStore.campaigns.unshift(newCampaign);

  return {
    data: newCampaign,
    success: true,
    message: "Campaign created successfully",
  };
}

/**
 * Schedules a campaign for broadcast execution
 */
export async function scheduleCampaign(
  id: string,
  scheduledAt: string,
): Promise<ApiResponse<Campaign>> {
  await delay(200, 600);
  const campaign = mockStore.campaigns.find((c) => c.id === id);

  if (!campaign) {
    throw new Error(`Campaign with ID ${id} not found`);
  }

  campaign.status = "scheduled";
  campaign.scheduledAt = scheduledAt;
  campaign.updatedAt = new Date().toISOString();

  return {
    data: { ...campaign },
    success: true,
    message: `Campaign scheduled for ${scheduledAt}`,
  };
}

/**
 * Cancels a scheduled or active campaign
 */
export async function cancelCampaign(id: string): Promise<ApiResponse<Campaign>> {
  await delay(200, 600);
  const campaign = mockStore.campaigns.find((c) => c.id === id);

  if (!campaign) {
    throw new Error(`Campaign with ID ${id} not found`);
  }

  campaign.status = "paused";
  campaign.updatedAt = new Date().toISOString();

  return {
    data: { ...campaign },
    success: true,
    message: "Campaign cancelled/paused successfully",
  };
}

/**
 * Deletes a campaign (e.g. if in draft status)
 */
export async function deleteCampaign(id: string): Promise<ApiResponse<void>> {
  await delay(200, 600);
  const index = mockStore.campaigns.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error(`Campaign with ID ${id} not found`);
  }

  mockStore.campaigns.splice(index, 1);

  return {
    data: undefined as unknown as void,
    success: true,
    message: "Campaign deleted successfully",
  };
}

/**
 * Duplicates an existing campaign as a draft
 */
export async function duplicateCampaign(id: string): Promise<ApiResponse<Campaign>> {
  await delay(200, 600);
  const original = mockStore.campaigns.find((c) => c.id === id);

  if (!original) {
    throw new Error(`Campaign with ID ${id} not found`);
  }

  const now = new Date().toISOString();
  const nextNum = mockStore.campaigns.length + 1;
  const newId = `campaign_${String(nextNum).padStart(3, "0")}`;

  const copy: Campaign = {
    ...original,
    id: newId,
    name: `Copy of ${original.name}`,
    status: "draft",
    scheduledAt: undefined,
    sentAt: undefined,
    completedAt: undefined,
    stats: {
      total: original.audienceCount,
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      failed: 0,
      clicked: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  mockStore.campaigns.unshift(copy);

  return {
    data: copy,
    success: true,
    message: "Campaign duplicated as draft",
  };
}
