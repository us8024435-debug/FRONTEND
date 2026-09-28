import {
  Contact,
  Conversation,
  Message,
  Template,
  Campaign,
  Segment,
  Activity,
  Note,
  Agent,
  Tag,
  DashboardMetrics,
} from "@/lib/types";
import {
  mockContacts,
  mockConversations,
  mockMessages,
  mockTemplates,
  mockCampaigns,
  mockSegments,
  mockActivities,
  mockNotes,
  mockAgents,
  mockTags,
  mockDashboardMetrics,
  registerStoreReset,
} from "@/lib/mock-data";

/**
 * In-memory mutable data store for the session.
 * Allows creates, updates, and deletes to persist across navigation and queries.
 */
class MockDataStore {
  public contacts: Contact[] = [];
  public conversations: Conversation[] = [];
  public messages: Record<string, Message[]> = {};
  public templates: Template[] = [];
  public campaigns: Campaign[] = [];
  public segments: Segment[] = [];
  public activities: Record<string, Activity[]> = {};
  public notes: Record<string, Note[]> = {};
  public agents: Agent[] = [];
  public tags: Tag[] = [];
  public dashboard: DashboardMetrics = { ...mockDashboardMetrics };

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.contacts = JSON.parse(JSON.stringify(mockContacts));
    this.conversations = JSON.parse(JSON.stringify(mockConversations));
    this.messages = JSON.parse(JSON.stringify(mockMessages));
    this.templates = JSON.parse(JSON.stringify(mockTemplates));
    this.campaigns = JSON.parse(JSON.stringify(mockCampaigns));
    this.segments = JSON.parse(JSON.stringify(mockSegments));
    this.activities = JSON.parse(JSON.stringify(mockActivities));
    this.notes = JSON.parse(JSON.stringify(mockNotes));
    this.agents = JSON.parse(JSON.stringify(mockAgents));
    this.tags = JSON.parse(JSON.stringify(mockTags));
    this.dashboard = JSON.parse(JSON.stringify(mockDashboardMetrics));
  }
}

export const mockStore = new MockDataStore();

// Register with global resetDemoData
registerStoreReset(() => {
  mockStore.reset();
});
