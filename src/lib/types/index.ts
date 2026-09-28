/**
 * WhatsApp CRM - Complete TypeScript Type System
 * All date fields are ISO 8601 strings. All IDs are strings.
 */

// ==========================================
// UNION TYPES
// ==========================================

export type MessageDirection = "inbound" | "outbound";

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "document"
  | "audio"
  | "template"
  | "interactive"
  | "location"
  | "contact";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type ConversationStatus = "open" | "pending" | "resolved" | "expired";

export type ConversationChannel = "whatsapp";

export type ConversationPriority = "low" | "medium" | "high";

export type ContactStatus = "active" | "inactive" | "blocked";

export type TemplateStatus = "draft" | "pending" | "approved" | "rejected" | "paused";

export type TemplateCategory = "marketing" | "utility" | "authentication";

export type TemplateHeaderType = "none" | "text" | "image" | "video" | "document";

export type TemplateButtonType = "quick_reply" | "url" | "phone" | "copy_code";

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed";

export type AgentRole = "admin" | "manager" | "agent";

export type AgentStatus = "online" | "away" | "offline";

export type ActivityType =
  | "message_sent"
  | "message_received"
  | "tag_added"
  | "tag_removed"
  | "note_added"
  | "assigned"
  | "status_changed"
  | "campaign_sent"
  | "contact_created"
  | "contact_updated";

export type SegmentOperator =
  "is" | "is_not" | "contains" | "not_contains" | "gt" | "lt" | "between" | "in" | "not_in";

export type SegmentConjunction = "and" | "or";

export type MessageSenderType = "contact" | "agent" | "system" | "bot";

export type TemplateQualityScore = "green" | "yellow" | "red" | "unknown";

export type CampaignScheduleType = "now" | "later";

export type SortOrder = "asc" | "desc";

// ==========================================
// CORE ENTITY INTERFACES
// ==========================================

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: AgentRole;
  status: AgentStatus;
  activeConversations: number;
  maxConversations: number;
  departments: string[];
  lastActiveAt?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  phone: string; // E.164 format (e.g. +91 98765 43210)
  name: string;
  email?: string;
  avatarUrl?: string;
  status: ContactStatus;
  tags: Tag[];
  customAttributes: Record<string, string | number | boolean>;
  assignedAgentId?: string;
  optInStatus: boolean;
  optInTimestamp?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageContent {
  text?: string;
  caption?: string;
  mediaUrl?: string;
  mediaMimeType?: string;
  fileName?: string;
  latitude?: number;
  longitude?: number;
  templateName?: string;
  templateVariables?: Record<string, string>;
  buttons?: Array<{ id: string; title: string }>;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  type: MessageType;
  content: MessageContent;
  status: MessageStatus;
  senderType: MessageSenderType;
  senderId?: string;
  templateId?: string;
  replyToMessageId?: string;
  timestamp: string;
  metadata?: {
    waMessageId?: string;
    errorCode?: string;
    errorMessage?: string;
  };
}

export interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;
  channel: ConversationChannel;
  status: ConversationStatus;
  assignedAgentId?: string;
  assignedAgent?: Agent;
  lastMessage?: Message;
  unreadCount: number;
  tags: Tag[];
  priority: ConversationPriority;
  windowExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateButton {
  type: TemplateButtonType;
  text: string;
  url?: string;
  phoneNumber?: string;
  example?: string;
}

export interface Template {
  id: string;
  name: string; // snake_case identifier
  displayName: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  header?: {
    type: TemplateHeaderType;
    text?: string;
    mediaUrl?: string;
    variables?: string[];
  };
  body: {
    text: string;
    variables?: string[];
    examples?: string[];
  };
  footer?: {
    text?: string;
  };
  buttons?: TemplateButton[];
  rejectionReason?: string;
  qualityScore?: TemplateQualityScore;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentFilter {
  id: string;
  field: string;
  operator: SegmentOperator;
  value: string | number | string[];
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  conjunction: SegmentConjunction;
  estimatedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  clicked: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  templateId: string;
  template?: Template;
  segmentId?: string;
  segment?: Segment;
  audienceCount: number;
  scheduledAt?: string;
  sentAt?: string;
  completedAt?: string;
  stats: CampaignStats;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  contactId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  performedById?: string;
  performedBy?: Agent;
  timestamp: string;
}

export interface Note {
  id: string;
  contactId: string;
  content: string;
  createdById: string;
  createdBy?: Agent;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// API RESPONSE SHAPES
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface DashboardMetrics {
  totalContacts: number;
  activeConversations: number;
  messagesToday: number;
  responseTime: {
    average: number;
    median: number;
    p95: number;
  };
  messageVolume: Array<{
    date: string;
    sent: number;
    received: number;
  }>;
  deliveryFunnel: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
  };
  campaignPerformance: Array<{
    campaignId: string;
    name: string;
    stats: CampaignStats;
  }>;
  agentPerformance: Array<{
    agentId: string;
    name: string;
    resolved: number;
    avgResponseTime: number;
    satisfaction: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    name: string;
    sentCount: number;
    deliveryRate: number;
    readRate: number;
  }>;
}

// ==========================================
// FILTER TYPES
// ==========================================

export interface ContactFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: ContactStatus;
  tags?: string[];
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface ConversationFilters {
  status?: ConversationStatus | "all";
  search?: string;
  assignedTo?: string | "all";
}

export interface TemplateFilters {
  status?: TemplateStatus;
  category?: TemplateCategory;
  search?: string;
}

export interface CampaignFilters {
  status?: CampaignStatus;
  search?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// ==========================================
// INPUT TYPES
// ==========================================

export interface CreateContactInput {
  phone: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  status?: ContactStatus;
  tags?: string[];
  customAttributes?: Record<string, string | number | boolean>;
  assignedAgentId?: string;
  optInStatus?: boolean;
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface SendMessageInput {
  type: MessageType;
  content: MessageContent;
}

export interface CreateTemplateInput {
  name: string;
  displayName: string;
  category: TemplateCategory;
  language: string;
  status?: TemplateStatus;
  header?: {
    type: TemplateHeaderType;
    text?: string;
    mediaUrl?: string;
    variables?: string[];
  };
  body: {
    text: string;
    variables?: string[];
    examples?: string[];
  };
  footer?: {
    text?: string;
  };
  buttons?: TemplateButton[];
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;

export interface CreateCampaignInput {
  name: string;
  segmentId?: string;
  templateId: string;
  variables?: Record<string, string>;
  scheduleType: CampaignScheduleType;
  scheduledAt?: string;
}
