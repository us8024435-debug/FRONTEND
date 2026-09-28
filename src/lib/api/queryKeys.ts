import {
  ContactFilters,
  ConversationFilters,
  TemplateFilters,
  CampaignFilters,
  SegmentFilter,
} from "@/lib/types";

/**
 * TanStack Query Key Factory
 * Hierarchical key definitions spreading from parent keys with `as const`
 */
export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    metrics: () => [...queryKeys.dashboard.all, "metrics"] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (filters?: ContactFilters) => [...queryKeys.contacts.lists(), { filters }] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
    activities: (id: string) => [...queryKeys.contacts.detail(id), "activities"] as const,
    notes: (id: string) => [...queryKeys.contacts.detail(id), "notes"] as const,
    conversations: (id: string) => [...queryKeys.contacts.detail(id), "conversations"] as const,
  },
  conversations: {
    all: ["conversations"] as const,
    lists: () => [...queryKeys.conversations.all, "list"] as const,
    list: (filters?: ConversationFilters) =>
      [...queryKeys.conversations.lists(), { filters }] as const,
    details: () => [...queryKeys.conversations.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.conversations.details(), id] as const,
    messages: (id: string, page?: number) =>
      [...queryKeys.conversations.detail(id), "messages", { page }] as const,
  },
  templates: {
    all: ["templates"] as const,
    lists: () => [...queryKeys.templates.all, "list"] as const,
    list: (filters?: TemplateFilters) => [...queryKeys.templates.lists(), { filters }] as const,
    details: () => [...queryKeys.templates.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.templates.details(), id] as const,
  },
  campaigns: {
    all: ["campaigns"] as const,
    lists: () => [...queryKeys.campaigns.all, "list"] as const,
    list: (filters?: CampaignFilters) => [...queryKeys.campaigns.lists(), { filters }] as const,
    details: () => [...queryKeys.campaigns.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.campaigns.details(), id] as const,
  },
  segments: {
    all: ["segments"] as const,
    list: () => [...queryKeys.segments.all, "list"] as const,
    detail: (id: string) => [...queryKeys.segments.all, "detail", id] as const,
    estimate: (filters: SegmentFilter[]) =>
      [...queryKeys.segments.all, "estimate", { filters }] as const,
  },
  agents: {
    all: ["agents"] as const,
    list: () => [...queryKeys.agents.all, "list"] as const,
    detail: (id: string) => [...queryKeys.agents.all, "detail", id] as const,
  },
  tags: {
    all: ["tags"] as const,
    list: () => [...queryKeys.tags.all, "list"] as const,
  },
} as const;
