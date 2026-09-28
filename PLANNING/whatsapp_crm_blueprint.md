# WhatsApp CRM — Pre-Build Blueprint
**Production-Grade Frontend Prototype | 4-Day Sprint Plan**
**Senior Frontend Engineer | 28 September 2026**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Data Model & Types](#2-data-model--types)
3. [Data Flow & Fetching Strategy](#3-data-flow--fetching-strategy)
4. [Component & UI System](#4-component--ui-system)
5. [Forms & Validation](#5-forms--validation)
6. [Error Handling & Edge States](#6-error-handling--edge-states)
7. [Performance Strategy](#7-performance-strategy)
8. [Accessibility (a11y)](#8-accessibility-a11y)
9. [Security & Privacy Considerations](#9-security--privacy-considerations)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment & CI/CD](#11-deployment--cicd)
12. [Observability & Monitoring](#12-observability--monitoring)
13. [Documentation Plan](#13-documentation-plan)
14. [Risk Register & Mitigation](#14-risk-register--mitigation)
15. [4-Day Execution Map](#15-4-day-execution-map)

---

## 1. Architecture Overview

### 1.1 Layer Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │ components/  │  │ components/  │  │  components/shared/ │  │
│  │ ui/ (Shadcn) │  │ crm/ (domain)│  │  (Layout, Nav, …)  │  │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬───────────┘  │
├─────────┼─────────────────┼────────────────────┼──────────────┤
│                      STATE & DATA LAYER                       │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │   Zustand    │  │ TanStack Query │  │ React Hook Form  │   │
│  │  (UI state)  │  │ (server state) │  │  (form state)    │   │
│  └──────────────┘  └───────┬────────┘  └──────────────────┘   │
├────────────────────────────┼──────────────────────────────────┤
│                      FETCHER LAYER                            │
│             lib/api/*.ts  (fetcher functions)                 │
│                      ← SWAP POINT →                           │
├──────────────┬─────────────────────────────────┬──────────────┤
│  NOW (Mock)  │                                 │ LATER (Real) │
│  lib/mock-   │                                 │ fetch() →    │
│  data/*.ts   │                                 │ Meta WABA    │
│  + delay()   │                                 │ + Backend    │
└──────────────┘                                 └──────────────┘
```

### 1.2 Next.js App Router Structure

```
src/app/
├── layout.tsx                      # RootLayout: <html>, providers, fonts, ThemeProvider
├── page.tsx                        # Redirect → /dashboard
├── not-found.tsx                   # Global 404
├── error.tsx                       # Global error boundary
├── loading.tsx                     # Global loading fallback
│
├── (auth)/                         # Auth route group (no CRM shell)
│   ├── login/page.tsx              # Mock login screen
│   └── layout.tsx                  # Minimal centered layout
│
├── (crm)/                          # CRM route group (shared shell)
│   ├── layout.tsx                  # Sidebar + TopBar + Providers
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard page
│   │   ├── loading.tsx             # Dashboard skeleton
│   │   └── error.tsx               # Dashboard error boundary
│   ├── inbox/
│   │   ├── page.tsx                # Conversation list + chat
│   │   ├── [conversationId]/
│   │   │   └── page.tsx            # Deep-linked conversation
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── contacts/
│   │   ├── page.tsx                # Contacts table
│   │   ├── [contactId]/
│   │   │   └── page.tsx            # Contact profile detail
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── templates/
│   │   ├── page.tsx                # Template list
│   │   ├── new/page.tsx            # Template builder
│   │   ├── [templateId]/
│   │   │   └── page.tsx            # Template edit/view
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── campaigns/
│   │   ├── page.tsx                # Campaign history
│   │   ├── new/page.tsx            # Campaign wizard
│   │   ├── [campaignId]/
│   │   │   └── page.tsx            # Campaign detail + analytics
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── team/
│   │   ├── page.tsx                # Agent list + roles
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── automation/
│   │   ├── page.tsx                # Workflow list
│   │   ├── [workflowId]/
│   │   │   └── page.tsx            # React Flow canvas
│   │   ├── loading.tsx
│   │   └── error.tsx
│   └── settings/
│       └── page.tsx                # App settings (placeholder)
```

### 1.3 Component System

| Directory | Contents | Ownership |
|---|---|---|
| `components/ui/` | Shadcn primitives: Button, Input, Select, Dialog, Sheet, Card, Badge, Avatar, Tabs, Command, Tooltip, Skeleton, DropdownMenu, Table, ScrollArea, Separator, Popover, Calendar, Checkbox, Switch, Textarea | Auto-generated by Shadcn CLI, customized via CSS vars |
| `components/crm/` | Domain components: `MessageBubble`, `ConversationRow`, `DeliveryTicks`, `TypingIndicator`, `AttachmentChip`, `TemplatePreview`, `CampaignStepper`, `AudienceFilterBuilder`, `ContactActivityTimeline`, `MetricCard`, `StatusBadge`, `TagInput`, `AutomationNode` | Team-built, domain-specific |
| `components/shared/` | Layout: `Sidebar`, `TopBar`, `AppShell`, `PageHeader`, `BreadcrumbNav`, `SearchBar`, `DataTable`, `EmptyState`, `DateRangePicker`, `ConfirmDialog`, `Stepper`, `Wizard`, `LoadingOverlay` | Shared across all modules |

### 1.4 State Split

| State Type | Tool | Scope | Examples |
|---|---|---|---|
| **Server State** | TanStack Query v5 | API data, cached entities | Contacts list, conversations, messages, templates, campaigns, agents |
| **UI State** | Zustand | Client-only ephemeral state | Active sidebar tab, selected conversation ID, drawer open/close, filter panel state, wizard step, selected rows |
| **Form State** | React Hook Form + Zod | Per-form lifecycle | Contact add/edit, template builder, campaign wizard steps, audience filters, message composer |
| **URL State** | Next.js router + searchParams | Shareable/bookmarkable state | Active tab, page number, sort column, filter params, conversation ID |

> [!IMPORTANT]
> **Golden rule:** If data comes from (or will come from) an API → TanStack Query. If it's UI-only and resets on page leave → Zustand. If it's form input → React Hook Form. If it should survive a page refresh or be shareable → URL searchParams.

---

## 2. Data Model & Types

### 2.1 Core TypeScript Interfaces

```typescript
// lib/types/index.ts

// ── Enums & Unions ──────────────────────────────────────────

type MessageDirection = "inbound" | "outbound";
type MessageType = "text" | "image" | "video" | "document" | "audio" | "template" | "interactive" | "location" | "contact";
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
type ConversationStatus = "open" | "pending" | "resolved" | "expired";
type ConversationChannel = "whatsapp";
type ContactStatus = "active" | "inactive" | "blocked";
type TemplateStatus = "draft" | "pending" | "approved" | "rejected" | "paused";
type TemplateCategory = "marketing" | "utility" | "authentication";
type TemplateHeaderType = "none" | "text" | "image" | "video" | "document";
type TemplateButtonType = "quick_reply" | "url" | "phone" | "copy_code";
type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed";
type AgentRole = "admin" | "manager" | "agent";
type AgentStatus = "online" | "away" | "offline";
type ActivityType = "message_sent" | "message_received" | "tag_added" | "tag_removed" | "note_added" | "assigned" | "status_changed" | "campaign_sent" | "contact_created" | "contact_updated";
type SegmentOperator = "is" | "is_not" | "contains" | "not_contains" | "gt" | "lt" | "between" | "in" | "not_in";
type SegmentConjunction = "and" | "or";

// ── Core Entities ───────────────────────────────────────────

interface Contact {
  id: string;
  phone: string;                    // E.164 format: +919876543210
  name: string;
  email?: string;
  avatarUrl?: string;
  status: ContactStatus;
  tags: Tag[];
  customAttributes: Record<string, string | number | boolean>;
  assignedAgentId?: string;
  optInStatus: boolean;
  optInTimestamp?: string;          // ISO 8601
  lastMessageAt?: string;          // ISO 8601
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;                 // Denormalized for list display
  channel: ConversationChannel;
  status: ConversationStatus;
  assignedAgentId?: string;
  assignedAgent?: Agent;            // Denormalized
  lastMessage?: Message;            // Denormalized for preview
  unreadCount: number;
  tags: Tag[];
  priority: "low" | "medium" | "high";
  windowExpiresAt?: string;         // 24-hour WhatsApp window
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  type: MessageType;
  content: MessageContent;
  status: MessageStatus;
  senderType: "contact" | "agent" | "system" | "bot";
  senderId?: string;                // Agent ID if outbound
  templateId?: string;              // If sent via template
  replyToMessageId?: string;
  timestamp: string;                // ISO 8601
  metadata?: {
    waMessageId?: string;           // WhatsApp message ID (future)
    errorCode?: string;
    errorMessage?: string;
  };
}

interface MessageContent {
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

interface Template {
  id: string;
  name: string;                     // Snake_case per Meta requirement
  displayName: string;              // Human-readable
  category: TemplateCategory;
  language: string;                 // e.g., "en_US", "hi"
  status: TemplateStatus;
  header?: {
    type: TemplateHeaderType;
    text?: string;
    mediaUrl?: string;
    variables?: string[];           // ["{{1}}"]
  };
  body: {
    text: string;                   // e.g., "Hello {{1}}, your order {{2}}..."
    variables?: string[];           // ["{{1}}", "{{2}}"]
    examples?: string[];            // ["John", "#12345"]
  };
  footer?: {
    text: string;
  };
  buttons?: TemplateButton[];
  rejectionReason?: string;
  qualityScore?: "green" | "yellow" | "red" | "unknown";
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateButton {
  type: TemplateButtonType;
  text: string;
  url?: string;                     // For URL buttons, may include {{1}}
  phoneNumber?: string;             // For phone buttons
  example?: string;                 // Example value for variable URL
}

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  templateId: string;
  template?: Template;              // Denormalized
  segmentId?: string;
  segment?: Segment;                // Denormalized
  audienceCount: number;
  scheduledAt?: string;             // ISO 8601
  sentAt?: string;
  completedAt?: string;
  stats: CampaignStats;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  clicked: number;                  // For CTA buttons
}

interface Segment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  conjunction: SegmentConjunction;  // How top-level filters combine
  estimatedCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SegmentFilter {
  id: string;
  field: string;                    // "tag", "status", "lastMessageAt", "customAttr.plan"
  operator: SegmentOperator;
  value: string | number | string[];
}

interface Agent {
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

interface Tag {
  id: string;
  name: string;
  color: string;                    // Hex or Tailwind color key
}

interface Activity {
  id: string;
  contactId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  performedById?: string;           // Agent ID
  performedBy?: Agent;
  timestamp: string;
}

interface Note {
  id: string;
  contactId: string;
  content: string;
  createdById: string;
  createdBy?: Agent;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── API Response Shapes ─────────────────────────────────────

interface PaginatedResponse<T> {
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

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;  // Field-level errors
}

// ── Dashboard Aggregates ────────────────────────────────────

interface DashboardMetrics {
  totalContacts: number;
  activeConversations: number;
  messagesToday: number;
  responseTime: {                   // Minutes
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
    satisfaction: number;           // 0-100
  }>;
  topTemplates: Array<{
    templateId: string;
    name: string;
    sentCount: number;
    deliveryRate: number;           // 0-1
    readRate: number;               // 0-1
  }>;
}
```

### 2.2 Mock Data File Structure

```
lib/mock-data/
├── index.ts            # Re-exports all mock data + delay() helper
├── contacts.ts         # 50 realistic contacts with Indian phone numbers
├── conversations.ts    # 25 conversations with varied statuses
├── messages.ts         # 200+ messages across conversations (text, image, template)
├── templates.ts        # 12 templates (approved, pending, rejected)
├── campaigns.ts        # 8 campaigns with varied statuses + realistic stats
├── segments.ts         # 5 pre-built audience segments
├── agents.ts           # 6 agents with varied roles + statuses
├── tags.ts             # 15 tags with color coding
├── activities.ts       # 100 activity log entries
├── notes.ts            # 30 contact notes
├── dashboard.ts        # Pre-computed dashboard metrics
└── seed.ts             # "Reset demo data" function → restores all to default
```

> [!TIP]
> **`delay()` helper:** Every mock fetcher wraps its return in `await delay(200, 600)` to simulate network latency. This ensures loading states, skeletons, and error boundaries are exercised during development.

```typescript
// lib/mock-data/index.ts
export const delay = (min = 200, max = 600): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  );
```

---

## 3. Data Flow & Fetching Strategy

### 3.1 TanStack Query Key Factory

```typescript
// lib/api/queryKeys.ts

export const queryKeys = {
  // ── Dashboard ──
  dashboard: {
    all: ["dashboard"] as const,
    metrics: () => [...queryKeys.dashboard.all, "metrics"] as const,
  },

  // ── Contacts ──
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (filters: ContactFilters) =>
      [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.contacts.details(), id] as const,
    activities: (id: string) =>
      [...queryKeys.contacts.detail(id), "activities"] as const,
    notes: (id: string) =>
      [...queryKeys.contacts.detail(id), "notes"] as const,
  },

  // ── Conversations ──
  conversations: {
    all: ["conversations"] as const,
    lists: () => [...queryKeys.conversations.all, "list"] as const,
    list: (filters: ConversationFilters) =>
      [...queryKeys.conversations.lists(), filters] as const,
    details: () => [...queryKeys.conversations.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.conversations.details(), id] as const,
    messages: (id: string, page?: number) =>
      [...queryKeys.conversations.detail(id), "messages", { page }] as const,
  },

  // ── Templates ──
  templates: {
    all: ["templates"] as const,
    lists: () => [...queryKeys.templates.all, "list"] as const,
    list: (filters?: TemplateFilters) =>
      [...queryKeys.templates.lists(), filters] as const,
    detail: (id: string) =>
      [...queryKeys.templates.all, "detail", id] as const,
  },

  // ── Campaigns ──
  campaigns: {
    all: ["campaigns"] as const,
    lists: () => [...queryKeys.campaigns.all, "list"] as const,
    list: (filters?: CampaignFilters) =>
      [...queryKeys.campaigns.lists(), filters] as const,
    detail: (id: string) =>
      [...queryKeys.campaigns.all, "detail", id] as const,
  },

  // ── Segments ──
  segments: {
    all: ["segments"] as const,
    list: () => [...queryKeys.segments.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.segments.all, "detail", id] as const,
    estimate: (filters: SegmentFilter[]) =>
      [...queryKeys.segments.all, "estimate", filters] as const,
  },

  // ── Agents ──
  agents: {
    all: ["agents"] as const,
    list: () => [...queryKeys.agents.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.agents.all, "detail", id] as const,
  },

  // ── Tags ──
  tags: {
    all: ["tags"] as const,
    list: () => [...queryKeys.tags.all, "list"] as const,
  },
} as const;
```

### 3.2 Fetcher Function Signatures

```typescript
// lib/api/contacts.ts
export async function fetchContacts(
  filters: ContactFilters
): Promise<PaginatedResponse<Contact>> { /* mock impl */ }

export async function fetchContact(id: string): Promise<ApiResponse<Contact>> { /* mock */ }

export async function createContact(
  data: CreateContactInput
): Promise<ApiResponse<Contact>> { /* mock */ }

export async function updateContact(
  id: string, data: UpdateContactInput
): Promise<ApiResponse<Contact>> { /* mock */ }

export async function deleteContact(id: string): Promise<ApiResponse<void>> { /* mock */ }

export async function addContactTag(
  contactId: string, tagId: string
): Promise<ApiResponse<Contact>> { /* mock */ }

export async function removeContactTag(
  contactId: string, tagId: string
): Promise<ApiResponse<Contact>> { /* mock */ }

// lib/api/conversations.ts
export async function fetchConversations(
  filters: ConversationFilters
): Promise<PaginatedResponse<Conversation>> { /* mock */ }

export async function fetchConversation(
  id: string
): Promise<ApiResponse<Conversation>> { /* mock */ }

export async function fetchMessages(
  conversationId: string, page?: number
): Promise<PaginatedResponse<Message>> { /* mock */ }

export async function sendMessage(
  conversationId: string, data: SendMessageInput
): Promise<ApiResponse<Message>> { /* mock — optimistic update */ }

export async function assignConversation(
  conversationId: string, agentId: string
): Promise<ApiResponse<Conversation>> { /* mock */ }

export async function updateConversationStatus(
  conversationId: string, status: ConversationStatus
): Promise<ApiResponse<Conversation>> { /* mock */ }

// lib/api/templates.ts
export async function fetchTemplates(
  filters?: TemplateFilters
): Promise<PaginatedResponse<Template>> { /* mock */ }

export async function fetchTemplate(
  id: string
): Promise<ApiResponse<Template>> { /* mock */ }

export async function createTemplate(
  data: CreateTemplateInput
): Promise<ApiResponse<Template>> { /* mock */ }

export async function updateTemplate(
  id: string, data: UpdateTemplateInput
): Promise<ApiResponse<Template>> { /* mock */ }

export async function deleteTemplate(id: string): Promise<ApiResponse<void>> { /* mock */ }

// lib/api/campaigns.ts
export async function fetchCampaigns(
  filters?: CampaignFilters
): Promise<PaginatedResponse<Campaign>> { /* mock */ }

export async function fetchCampaign(
  id: string
): Promise<ApiResponse<Campaign>> { /* mock */ }

export async function createCampaign(
  data: CreateCampaignInput
): Promise<ApiResponse<Campaign>> { /* mock */ }

export async function scheduleCampaign(
  id: string, scheduledAt: string
): Promise<ApiResponse<Campaign>> { /* mock */ }

export async function cancelCampaign(
  id: string
): Promise<ApiResponse<Campaign>> { /* mock */ }

// lib/api/dashboard.ts
export async function fetchDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> { /* mock */ }

// lib/api/segments.ts
export async function fetchSegments(): Promise<ApiResponse<Segment[]>> { /* mock */ }
export async function estimateAudienceCount(
  filters: SegmentFilter[]
): Promise<ApiResponse<{ count: number }>> { /* mock */ }

// lib/api/agents.ts
export async function fetchAgents(): Promise<ApiResponse<Agent[]>> { /* mock */ }
export async function updateAgentStatus(
  id: string, status: AgentStatus
): Promise<ApiResponse<Agent>> { /* mock */ }
```

### 3.3 Caching, Invalidation & Optimistic Updates

| Action | Invalidation | Optimistic? |
|---|---|---|
| Send message | `conversations.messages(id)` + `conversations.list(*)` (for preview) | ✅ Yes — append message to cache instantly, rollback on error |
| Add/remove tag on contact | `contacts.detail(id)` + `contacts.lists()` | ✅ Yes — update tag array in cache |
| Change conversation status | `conversations.detail(id)` + `conversations.lists()` | ✅ Yes — update status badge instantly |
| Assign conversation | `conversations.detail(id)` + `conversations.lists()` | ✅ Yes — show new agent avatar instantly |
| Create/edit contact | `contacts.lists()` + `contacts.detail(id)` | ❌ No — wait for confirmation, then invalidate |
| Create template | `templates.lists()` | ❌ No — server needs to validate |
| Create campaign | `campaigns.lists()` | ❌ No — show "Creating…" state |
| Dashboard metrics | `dashboard.metrics` | ❌ No — staleTime: 30s, refetchInterval: 60s |

**Global TanStack Query defaults:**

```typescript
// lib/providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,         // 5 minutes
      gcTime: 1000 * 60 * 30,           // 30 minutes garbage collection
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,       // CRM is long-lived tab
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 3.4 Pagination, Filtering, Sorting

| Module | Pattern | URL Sync? |
|---|---|---|
| Contacts table | Server-side pagination (page, pageSize) + server-side sorting (sortBy, sortOrder) + server-side filters (search, status, tags) | ✅ Yes — searchParams |
| Conversation list | Infinite scroll via `useInfiniteQuery` + client-side search filter | ❌ No — ephemeral |
| Messages | Reverse-chronological infinite scroll (load older on scroll up) | ❌ No |
| Templates list | Server-side pagination + filter by status/category | ✅ Yes — searchParams |
| Campaigns list | Server-side pagination + filter by status + date range | ✅ Yes — searchParams |
| Agent list | Client-side (small dataset, <50 agents) | ❌ No |

---

## 4. Component & UI System

### 4.1 Reusable Component Inventory

| Component | Location | Props Summary | Used In |
|---|---|---|---|
| `DataTable` | `shared/` | columns, data, pagination, sorting, filtering, selection, onRowClick | Contacts, Templates, Campaigns, Team |
| `SearchBar` | `shared/` | value, onChange, placeholder, debounceMs (300) | Inbox, Contacts, Templates |
| `TagInput` | `crm/` | tags, onAdd, onRemove, suggestions, maxTags | Contact profile, Conversation sidebar |
| `StatusBadge` | `crm/` | status, variant (conversation\|template\|campaign\|agent) | Everywhere |
| `DateRangePicker` | `shared/` | value, onChange, presets (Today, 7d, 30d, Custom) | Dashboard, Campaigns |
| `EmptyState` | `shared/` | icon, title, description, actionLabel, onAction | All modules |
| `Skeleton` variants | `shared/` | variant (card\|row\|chat\|table) | All loading states |
| `ConfirmDialog` | `shared/` | title, description, onConfirm, destructive? | Delete actions |
| `Stepper` | `shared/` | steps[], currentStep, onStepClick | Campaign wizard |
| `Wizard` | `shared/` | steps[], validation per step, onComplete | Campaign creation |
| `MetricCard` | `crm/` | title, value, change, changeType (up\|down), icon, loading | Dashboard |
| `PageHeader` | `shared/` | title, description, actions (ReactNode) | All pages |
| `BreadcrumbNav` | `shared/` | auto from route segments | All pages |

### 4.2 WhatsApp-Like UI Components

| Component | Key Design Details |
|---|---|
| `MessageBubble` | Rounded corners, green (outbound) / white (inbound), tail arrow, timestamp bottom-right, delivery ticks. Max-width 65%. Supports text, image (with lightbox), document (file chip), audio (waveform placeholder) |
| `ConversationRow` | Avatar + name + last message preview (truncated 1 line) + timestamp + unread badge (green circle with count). Active state: subtle background highlight |
| `DeliveryTicks` | Single gray ✓ (sent), double gray ✓✓ (delivered), double blue ✓✓ (read), ⏳ (sending), ❌ (failed with red) |
| `TypingIndicator` | Three animated dots in a bubble (CSS animation, not Framer) |
| `AttachmentChip` | File icon + filename + size badge. Click to open/download |
| `MessageComposer` | Input bar: attachment button, text input (auto-grow textarea), emoji picker (placeholder), send button. Template selector dropdown |
| `TemplatePreview` | WhatsApp-style card: header (text/image), body (with variable highlights in yellow), footer (gray italic), buttons (blue text) |

### 4.3 Framer Motion Usage Policy

| ✅ Animate (high-impact, low-frequency) | ❌ Do NOT animate (high-frequency, perf-sensitive) |
|---|---|
| Message bubble entrance (`AnimatePresence` + fade/slide up) | DataTable rows (dozens, frequent re-renders) |
| Sheet/Drawer open/close (slide from right) | Filter dropdowns opening |
| Wizard step transitions (slide left/right) | Search results updating |
| Dialog entrance (scale + fade) | Sidebar navigation links |
| Dashboard metric card number count-up | Badge count changes |
| Conversation switch (crossfade chat area) | Scroll position changes |
| Toast notifications (slide in from top-right) | Checkbox toggles |
| Empty state → content transition | — |

**Motion configuration:**

```typescript
// lib/motion.ts
export const motionConfig = {
  bubbleEnter: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" },
  },
  sheetSlide: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  wizardStep: {
    enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
} as const;
```

### 4.4 Theming Strategy

**Tailwind v4 CSS tokens** defined in `globals.css`:

```css
/* styles/globals.css */
@import "tailwindcss";

@theme {
  /* ── Brand Colors ── */
  --color-whatsapp: #25D366;
  --color-whatsapp-dark: #128C7E;
  --color-whatsapp-light: #DCF8C6;
  --color-whatsapp-teal: #075E54;

  /* ── CRM Accent Palette ── */
  --color-primary: #6366F1;          /* Indigo 500 */
  --color-primary-foreground: #FFFFFF;

  /* ── Semantic Colors ── */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* ── Chat Bubble Colors ── */
  --color-bubble-outbound: #DCF8C6;
  --color-bubble-inbound: #FFFFFF;
  --color-bubble-outbound-dark: #005C4B;
  --color-bubble-inbound-dark: #1F2937;
}
```

**Dark/Light mode:** Use `next-themes` (ThemeProvider wrapping the app). Shadcn components already support dark mode via CSS variables. Chat bubbles swap between WhatsApp green/white (light) and teal/dark-gray (dark).

---

## 5. Forms & Validation

### 5.1 Zod Schemas

```typescript
// lib/validators/contact.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, "Must be E.164 format (e.g., +919876543210)"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  customAttributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  optInStatus: z.boolean().default(true),
});

export type CreateContactInput = z.infer<typeof contactSchema>;

// lib/validators/template.ts
export const templateButtonSchema = z.object({
  type: z.enum(["quick_reply", "url", "phone", "copy_code"]),
  text: z.string().min(1).max(25, "Button text max 25 chars"),
  url: z.string().url("Must be a valid URL").optional(),
  phoneNumber: z.string().optional(),
});

export const templateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(512)
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
  displayName: z.string().min(1).max(200),
  category: z.enum(["marketing", "utility", "authentication"]),
  language: z.string().min(2).max(10),
  header: z.object({
    type: z.enum(["none", "text", "image", "video", "document"]),
    text: z.string().max(60, "Header text max 60 chars").optional(),
    mediaUrl: z.string().url().optional(),
  }).optional(),
  body: z.object({
    text: z.string().min(1, "Body text is required").max(1024, "Body max 1024 chars"),
    examples: z.array(z.string()).optional(),
  }),
  footer: z.object({
    text: z.string().max(60, "Footer max 60 chars"),
  }).optional(),
  buttons: z.array(templateButtonSchema).max(3, "Maximum 3 buttons").optional(),
});

export type CreateTemplateInput = z.infer<typeof templateSchema>;

// lib/validators/campaign.ts
export const campaignStep1Schema = z.object({
  name: z.string().min(1, "Campaign name is required").max(200),
});

export const campaignStep2Schema = z.object({
  segmentId: z.string().min(1, "Select an audience"),
});

export const campaignStep3Schema = z.object({
  templateId: z.string().min(1, "Select a template"),
  variables: z.record(z.string(), z.string()).optional(),
});

export const campaignStep4Schema = z.object({
  scheduleType: z.enum(["now", "later"]),
  scheduledAt: z.string().optional(),
}).refine(
  (data) => data.scheduleType === "now" || (data.scheduleType === "later" && data.scheduledAt),
  { message: "Schedule date is required", path: ["scheduledAt"] }
);

// lib/validators/audience.ts
export const segmentFilterSchema = z.object({
  field: z.string().min(1, "Select a field"),
  operator: z.enum(["is", "is_not", "contains", "not_contains", "gt", "lt", "between", "in", "not_in"]),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
});

export const segmentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  filters: z.array(segmentFilterSchema).min(1, "At least one filter is required"),
  conjunction: z.enum(["and", "or"]).default("and"),
});
```

### 5.2 Dynamic Form Patterns

| Pattern | Implementation |
|---|---|
| **Template buttons** (`useFieldArray`) | `const { fields, append, remove } = useFieldArray({ control, name: "buttons" })`. Max 3 buttons. Each row: type select, text input, conditional URL/phone input |
| **Variable insertion** | Regex scan body text for `{{n}}`. Render example inputs dynamically. Use `watch("body.text")` to reactively count variables |
| **Audience filter builder** | `useFieldArray` for filter rows. Each row: field select → operator select → value input (type changes based on field). Add/remove rows |
| **Campaign wizard** | Multi-step form with separate schema per step. Use `trigger()` for per-step validation before proceeding. Persist across steps via parent form context |

### 5.3 Error Display Patterns

| Level | Component | Behavior |
|---|---|---|
| **Field-level** | Shadcn `FormMessage` | Red text below input, appears on blur or submit. Animates in with fade |
| **Form-level** | `FormSummary` component | Alert at top of form: "Please fix 3 errors below". Lists clickable field names |
| **Toast notification** | Shadcn `Toaster` + `sonner` | Success (green), Error (red), Info (blue). Auto-dismiss 5s, manual dismiss. Position: top-right |
| **Mutation error** | TanStack Query `onError` | Maps `ApiError.details` to field-level via `setError()`. Falls back to toast for non-field errors |

---

## 6. Error Handling & Edge States

### 6.1 Error Boundary Strategy

```
app/
├── error.tsx                    # Global catch-all: full-page error + "Go Home" button
├── (crm)/
│   ├── dashboard/error.tsx      # Dashboard-specific: retry button + stale data fallback
│   ├── inbox/error.tsx          # Inbox: "Connection lost" banner + auto-retry
│   ├── contacts/error.tsx       # Contacts: retry + "Clear filters" suggestion
│   ├── templates/error.tsx      # Templates: retry
│   ├── campaigns/error.tsx      # Campaigns: retry
│   └── automation/error.tsx     # Automation: retry + "React Flow crashed" recovery
```

### 6.2 TanStack Query Error Handling

```typescript
// lib/hooks/useQueryErrorHandler.ts
export function useQueryErrorHandler() {
  const { toast } = useToast();

  return {
    onError: (error: Error) => {
      console.error("[Query Error]", error);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: error.message || "Please try again",
      });
    },
  };
}

// Retry logic: 2 retries, exponential backoff, skip retry on 4xx errors
// Configured globally in QueryClient defaults (see §3.3)
```

### 6.3 Empty States

| Module | Trigger | EmptyState Content |
|---|---|---|
| Inbox | No conversations | 💬 "No conversations yet" — "Conversations will appear here when customers message you" |
| Inbox (filtered) | No filter results | 🔍 "No matches" — "Try adjusting your filters" + [Clear Filters] |
| Contacts | No contacts | 👥 "Add your first contact" — "Import contacts or add them manually" + [Add Contact] |
| Contacts (filtered) | No filter/search results | 🔍 "No contacts found" — "Try a different search or filter" + [Clear] |
| Templates | No templates | 📝 "Create your first template" — "Templates let you send pre-approved messages" + [Create Template] |
| Campaigns | No campaigns | 📢 "No campaigns yet" — "Send your first bulk message" + [Create Campaign] |
| Activity (contact) | No activity | 📋 "No activity yet" — "Activity will be logged here automatically" |
| Notes (contact) | No notes | 📌 "No notes" — "Add notes about this contact" + [Add Note] |

### 6.4 Loading States

| Component | Skeleton Pattern |
|---|---|
| Dashboard KPI cards | 4 `Skeleton` rectangles (w-full h-28) in a grid |
| Dashboard charts | `Skeleton` rectangles matching chart aspect ratio |
| Conversation list | 8 rows: `Skeleton` circle (avatar) + 2 `Skeleton` lines |
| Chat messages | 6 alternating left/right `Skeleton` bubbles |
| Contact table | `Skeleton` table: header row + 10 body rows |
| Contact profile | `Skeleton` avatar + 3 text lines + tag pills |
| Template list | `Skeleton` cards (h-32) in a grid |
| Campaign wizard | Current step content replaced with `Skeleton` block |

---

## 7. Performance Strategy

### 7.1 Code Splitting

| Module | Strategy | Reason |
|---|---|---|
| React Flow (`/automation`) | `next/dynamic` with `{ ssr: false, loading: () => <Skeleton /> }` | ~35KB gzipped, only needed on 1 page |
| Recharts (`/dashboard`, `/campaigns/[id]`) | Route-level split (App Router handles automatically) | ~45KB, only 2 routes |
| Framer Motion | Import `motion` and `AnimatePresence` only (no full bundle) | Tree-shake to ~15KB |
| Emoji picker (if added) | `next/dynamic` lazy load on click | Large bundle, rarely used |

### 7.2 List Virtualization

| List | Virtualize? | Rationale |
|---|---|---|
| Conversation list | **Maybe (Day 4 polish)** — only if >200 conversations feel sluggish. Use `@tanstack/react-virtual` if needed | Typical CRM has 20-100 visible conversations |
| Contact table | **No** — server-side pagination at 25 rows/page | Never renders >25 rows |
| Messages in chat | **Maybe (Day 4 polish)** — reverse infinite scroll with `@tanstack/react-virtual` for conversations with 500+ messages | Most conversations <100 messages |
| Template/Campaign lists | **No** — small datasets | Typically <50 items |

### 7.3 Image & Media Handling

| Concern | Solution |
|---|---|
| Lazy loading | `loading="lazy"` on all `<img>` tags; `next/image` with `placeholder="blur"` where applicable |
| Size constraints | Chat images: max `300×400px` display, thumbnail on click → full-size lightbox |
| Media in messages | Mock URLs pointing to placeholder images (e.g., `picsum.photos`); real API will use WhatsApp CDN URLs |
| Avatar images | Fallback to initials via `AvatarFallback` (Shadcn Avatar) |

### 7.4 Bundle Budget

| Dependency | Gzipped Size | Load Condition |
|---|---|---|
| Next.js + React | ~90KB | Always |
| Shadcn/Radix primitives | ~15KB (tree-shaken) | Always |
| TanStack Query | ~12KB | Always |
| Zustand | ~2KB | Always |
| React Hook Form + Zod | ~13KB | Forms pages |
| Framer Motion | ~15KB (tree-shaken) | Pages with animation |
| Recharts | ~45KB | Dashboard, campaign detail |
| TanStack Table | ~14KB | Tables pages |
| React Flow | ~35KB | `/automation` only |
| Day.js | ~2KB | Always |
| Lucide React | ~3KB (tree-shaken) | Always |
| **Total initial load** | **~152KB** | — |
| **Max per-page** | **~200KB** | Dashboard (charts) |

> [!NOTE]
> Budget target: <250KB gzipped initial JS. Validate with `next build` output + `@next/bundle-analyzer` on Day 4.

---

## 8. Accessibility (a11y)

### 8.1 Keyboard Navigation

| Area | Keys | Behavior |
|---|---|---|
| Sidebar | `Tab` / `Shift+Tab` | Navigate links. `Enter` activates. Active page has `aria-current="page"` |
| Conversation list | `↑` / `↓` | Move selection. `Enter` opens conversation. Focus rings visible |
| Chat messages | `Tab` to composer | Focus jumps to message input. `Shift+Tab` to last message for screen reader |
| DataTable | `Tab` through headers (sortable), rows (selectable) | `Enter`/`Space` toggles sort, selects row |
| Dialogs/Sheets | `Escape` closes. Focus trapped inside. Return focus on close | Radix handles this natively |
| Wizard steps | `Tab` through form fields, `Enter` to submit step | Step buttons: previous/next |
| ⌘K search | `Cmd/Ctrl+K` opens. `↑`/`↓` navigates. `Enter` selects. `Escape` closes | Shadcn Command handles natively |

### 8.2 ARIA Labels

```typescript
// Mandatory patterns:
<Button aria-label="Send message" />          // Icon-only buttons
<Badge aria-label="3 unread messages">{3}</Badge>  // Dynamic badges
<Avatar aria-label="Agent: Priya Sharma" />   // Avatars
<input aria-describedby="phone-hint" />       // Inputs with hints
<nav aria-label="Main navigation" />          // Navigation regions
<main aria-label="Dashboard content" />       // Main content
<aside aria-label="Customer details" />       // Sidebars
```

### 8.3 Focus Management

| Scenario | Behavior |
|---|---|
| Open dialog/sheet | Focus first interactive element inside |
| Close dialog/sheet | Return focus to trigger element |
| Send message | Return focus to message input |
| Switch conversation | Focus message input |
| Wizard step change | Focus first field of new step |
| Delete action | Focus previous item in list |

### 8.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Framer Motion: wrap all animations in `useReducedMotion()` check. Disable spring animations, keep instant transitions.

---

## 9. Security & Privacy Considerations

### 9.1 Input Sanitization

| Vector | Mitigation |
|---|---|
| User-entered text (messages, notes, contact names) | React's default JSX escaping prevents XSS. Never use `dangerouslySetInnerHTML` |
| Template body text | Sanitize `{{variables}}` — validate format, strip HTML tags before display |
| Custom attribute values | Type-check via Zod schema, display as text nodes only |
| Search inputs | Debounce + sanitize before mock query (defense in depth for real API) |
| URL buttons in templates | Validate with `z.string().url()`, display in preview as plain text (not `<a>`) |

### 9.2 Auth Context (Mock)

```typescript
// lib/auth/AuthContext.tsx
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AgentRole;        // "admin" | "manager" | "agent"
  avatarUrl?: string;
}

// Mock: returns hardcoded admin user
// Real: will validate JWT from Meta/custom auth
export const useAuth = () => useContext(AuthContext);

// Role-based visibility:
// - Admin: all features, settings, team management
// - Manager: all features except settings
// - Agent: inbox, contacts (own assigned), templates (read-only)
```

### 9.3 Privacy

> [!CAUTION]
> **All mock data is fabricated.** No real PII is used. Mock phone numbers use `+91XXXXXXXXXX` format with randomly generated digits. Mock names are fictional. Add a visible "DEMO DATA" badge in the app shell during prototype phase.

---

## 10. Testing Strategy

### 10.1 Test Pyramid

| Layer | Tool | Count Target | Scope |
|---|---|---|---|
| **Unit** | Vitest | 50+ tests | Utils, formatters, Zod schemas, query key factory, mock data helpers |
| **Component** | Vitest + React Testing Library | 30+ tests | StatusBadge, MetricCard, MessageBubble, DeliveryTicks, TagInput, EmptyState, DataTable |
| **Integration** | Vitest + RTL + MSW | 15+ tests | Contact form submit, template builder, campaign wizard, table filtering, conversation switching |
| **E2E** | Playwright | 5 critical flows | Full demo walkthrough (see below) |

### 10.2 Critical E2E Flows

```
1. Dashboard → verify KPI cards render, charts load, click through to inbox
2. Inbox → search conversation → open → send message → see delivery ticks → resolve
3. Contacts → add contact → fill form → save → verify in table → open profile → add tag + note
4. Templates → create template → fill builder → preview → save → verify in list
5. Campaigns → create campaign → select audience → select template → preview → schedule
```

### 10.3 Test Data

```typescript
// lib/mock-data/seed.ts
export function resetDemoData(): void {
  // Restores all in-memory mock stores to initial state
  // Called by "Reset Demo Data" button in Settings or via API route
}

// Exposed as:
// - Button in Settings page (for manual use)
// - GET /api/reset-demo (for E2E tests: cy.request('/api/reset-demo'))
```

### 10.4 Testing Utilities

```typescript
// lib/test-utils/render.tsx
// Custom render that wraps components with:
// - QueryClientProvider (fresh QueryClient per test)
// - ThemeProvider
// - AuthProvider (mock admin user)
// - Toaster

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider user={mockAdminUser}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
    ...options,
  });
}
```

---

## 11. Deployment & CI/CD

### 11.1 Vercel Deployment

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Build command | `pnpm build` |
| Output directory | `.next` |
| Node version | 20.x |
| Install command | `pnpm install --frozen-lockfile` |
| Preview deploys | ✅ Auto per PR |
| Production branch | `main` |

### 11.2 Environment Variables

```env
# .env.local (development)
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_MODE=mock                    # "mock" | "real"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production (Vercel)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_MODE=mock                    # Switch to "real" when API is ready
NEXT_PUBLIC_APP_URL=https://whatsapp-crm.vercel.app

# Future (real API integration)
# WHATSAPP_API_TOKEN=<Meta WABA token>
# WHATSAPP_PHONE_NUMBER_ID=<phone number ID>
# WHATSAPP_BUSINESS_ACCOUNT_ID=<WABA ID>
# NEXT_PUBLIC_WEBHOOK_VERIFY_TOKEN=<webhook verify token>
```

### 11.3 Pre-Deploy Checklist

- [ ] `pnpm lint` — zero errors, zero warnings
- [ ] `pnpm typecheck` — `tsc --noEmit` passes
- [ ] `pnpm test` — all unit + integration tests pass
- [ ] `pnpm build` — production build succeeds
- [ ] `pnpm test:e2e` — Playwright smoke tests pass
- [ ] Bundle size check — no single route >250KB gzipped
- [ ] Lighthouse audit — Performance >90, Accessibility >95
- [ ] Manual check — dark mode, empty states, loading states, error states

---

## 12. Observability & Monitoring

### 12.1 Console Logging Policy

```typescript
// lib/logger.ts
const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const logger = {
  info: (msg: string, data?: unknown) => {
    if (!isProd) console.info(`[INFO] ${msg}`, data ?? "");
  },
  warn: (msg: string, data?: unknown) => {
    console.warn(`[WARN] ${msg}`, data ?? "");
  },
  error: (msg: string, error?: unknown) => {
    console.error(`[ERROR] ${msg}`, error ?? "");
    // Future: Sentry.captureException(error);
  },
  query: (key: string, status: string) => {
    if (!isProd) console.debug(`[Query] ${key}: ${status}`);
  },
};
```

### 12.2 Error Tracking (Placeholder)

```typescript
// TODO: Install @sentry/nextjs when moving to production
// Sentry DSN will be added as env variable
// Error boundaries will call Sentry.captureException()
// TanStack Query onError will forward to Sentry
```

### 12.3 Performance Monitoring

| Tool | Phase | Purpose |
|---|---|---|
| Vercel Analytics (Speed Insights) | Day 4+ | Real user metrics: LCP, FID, CLS |
| `@next/bundle-analyzer` | Day 4 | Verify bundle budget per route |
| Lighthouse CI | Pre-deploy | Automated perf/a11y scoring in CI |
| React DevTools Profiler | Dev | Identify unnecessary re-renders |

---

## 13. Documentation Plan

### 13.1 Files to Create

| File | Purpose | When |
|---|---|---|
| `README.md` | Setup, scripts, env vars, architecture overview, contributing | Day 1 (scaffold), update throughout |
| `DELIVERABLES.md` | Completed screens, demo script, known gaps, screenshots | Day 4 |
| `MOCK_VS_API.md` | Every mocked endpoint → what Meta/WhatsApp API it maps to, input/output diff | Day 4 |
| `docs/ARCHITECTURE.md` | Detailed component tree, data flow diagrams, state management decisions | Day 1 |
| `docs/COMPONENTS.md` | Component inventory with props tables, usage examples | Day 2-3 (as built) |
| `docs/DEMO_SCRIPT.md` | Step-by-step demo walkthrough for stakeholders (5 min) | Day 4 |

### 13.2 Inline Code Standards

```typescript
// ✅ DO: Comment non-obvious logic
// WhatsApp 24-hour window: contacts can only receive free-form messages
// within 24h of their last message. After that, only templates are allowed.
const isWindowOpen = dayjs(conversation.windowExpiresAt).isAfter(dayjs());

// ❌ DON'T: Comment obvious code
// This sets the name (BAD - obvious from code)
contact.name = formData.name;
```

### 13.3 Per-Module README Pattern

Each module directory (`components/inbox/`, etc.) gets a brief `README.md`:

```markdown
# Inbox Module
## Components
- `ConversationList` — Filterable list with search, unread badges
- `ChatWindow` — Message thread with auto-scroll, infinite history
- `MessageComposer` — Input bar with template selector
- `CustomerSidebar` — Contact details, tags, notes, activity

## Data Dependencies
- `useConversations(filters)` → `lib/api/conversations.ts`
- `useMessages(conversationId)` → `lib/api/conversations.ts`
- `useConversationStore()` → `lib/stores/conversationStore.ts`

## TODOs
- [ ] Implement attachment upload UI
- [ ] Add emoji picker
- [ ] Real-time message delivery via WebSocket (future)
```

---

## 14. Risk Register & Mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Scope creep** — "one more feature" pushes past 4 days | High | High | Feature freeze after Day 2. Day 3-4 additions are polish only. Maintain a "Post-MVP" backlog for anything that surfaces late |
| 2 | **Animation overuse** — Framer Motion on everything kills performance + eats dev time | Medium | Medium | Strict motion policy (§4.3). Animate only 8 specific interactions. No animation on high-frequency re-render components. Time-box motion work to 2h max |
| 3 | **Mock data inconsistency** — IDs don't cross-reference, timestamps are illogical | Medium | High | Seed mock data once from a single generation script (`seed.ts`). All IDs use deterministic format (`contact_001`). Run a consistency check script Day 1 |
| 4 | **Bundle bloat** — React Flow + Recharts + Framer Motion exceed budget | Low | Medium | Code-split React Flow (dynamic import). Tree-shake Framer Motion. Run `@next/bundle-analyzer` on Day 3. Budget: <250KB per route |
| 5 | **Timeline slippage** — Day 2 inbox module takes longer than planned | Medium | High | Daily demo checkpoint at end of each day. If inbox slips, simplify customer sidebar (remove activity timeline, keep tags + notes only). Contact profile detail is Day 4 polish, not Day 2 critical path |

---

## 15. 4-Day Execution Map

### Day 1: Foundation + Dashboard

**Goal:** App skeleton running, navigation working, dashboard rendering with mock data.

| Task | Files/Components | Est. Time |
|---|---|---|
| **Project scaffold** | `npx create-next-app`, pnpm, TypeScript strict, Tailwind v4, ESLint, Prettier | 1h |
| **Shadcn init** | `npx shadcn@latest init` + install 20 base components | 30m |
| **App shell** | `(crm)/layout.tsx`, `Sidebar`, `TopBar`, `AppShell` | 1.5h |
| **Theming** | `globals.css` tokens, dark/light mode, `next-themes` | 30m |
| **TypeScript types** | All interfaces from §2.1 | 30m |
| **Mock data** | `lib/mock-data/*` — contacts, conversations, agents, dashboard metrics | 1h |
| **API layer scaffold** | `lib/api/*` fetcher functions (mock implementations), `queryKeys.ts` | 1h |
| **TanStack Query provider** | `QueryProvider`, default config | 15m |
| **Zustand stores** | `uiStore` (sidebar, theme), `conversationStore` (activeId) | 30m |
| **Dashboard page** | `MetricCard` ×4, `Recharts` bar/line/donut charts, recent conversations table | 2h |
| **Shared components** | `PageHeader`, `EmptyState`, `StatusBadge`, `SearchBar`, `DataTable` (base) | 1h |
| **Loading/error states** | Dashboard skeleton, route error boundaries | 30m |

**Day 1 Demo Checkpoint:** Navigate sidebar → Dashboard loads with animated KPI cards + charts + recent activity table. Dark mode toggle works.

---

### Day 2: Inbox + Contacts

**Goal:** WhatsApp-like inbox with chat, conversation switching, customer sidebar. Contacts table with add/edit.

| Task | Files/Components | Est. Time |
|---|---|---|
| **Conversation list** | `ConversationRow`, `ConversationList` with search + status filter | 1.5h |
| **Chat window** | `ChatWindow`, `MessageBubble`, `DeliveryTicks`, message grouping by date | 2h |
| **Message composer** | `MessageComposer` — text input, send button, template selector dropdown | 1h |
| **Customer sidebar** | `CustomerSidebar` — contact details, `TagInput`, notes list, `AddNoteForm` | 1.5h |
| **Conversation assignment** | Agent selector dropdown, `assignConversation` mutation | 30m |
| **Typing indicator** | `TypingIndicator` — CSS-only animation | 15m |
| **Inbox Framer Motion** | Message bubble entrance, conversation switch crossfade | 30m |
| **Contacts table** | `DataTable` with sorting, filtering, pagination, row selection | 1.5h |
| **Contact add/edit** | `Sheet` drawer + `contactSchema` form + validation | 1h |
| **Contact profile** | `/contacts/[contactId]` — header, details card, tags, notes, activity timeline | 1h |
| **Mock data: messages** | 200+ messages across 25 conversations, varied types | 30m |
| **Loading/empty states** | Inbox skeleton, "No conversations" empty, contact table skeleton | 30m |

**Day 2 Demo Checkpoint:** Click conversation → chat loads → send message → delivery ticks animate. Open contacts → search/filter → add new contact → view profile with tags + notes.

---

### Day 3: Templates + Campaigns + Segments

**Goal:** Template builder with live preview. Campaign wizard with audience selection. Basic analytics.

| Task | Files/Components | Est. Time |
|---|---|---|
| **Template list** | Grid/list view, filter by status/category, `StatusBadge` | 1h |
| **Template builder** | Multi-section form: category, language, header (type toggle), body (variable detection), footer, buttons (`useFieldArray`) | 2.5h |
| **Template preview** | `TemplatePreview` — WhatsApp-style card rendering live as form changes | 1h |
| **Template Zod validation** | `templateSchema` with per-Meta character limits + format rules | 30m |
| **Campaign list** | DataTable with status, sent date, stats preview | 45m |
| **Campaign wizard** | `Stepper` + `Wizard` — 4 steps: Name → Audience → Template → Review/Schedule | 2h |
| **Audience filter builder** | `AudienceFilterBuilder` — dynamic filter rows, field/operator/value, live count estimate | 1.5h |
| **Campaign detail** | `/campaigns/[id]` — stats cards, delivery funnel chart (Recharts), recipient preview | 1h |
| **Wizard animations** | Framer Motion step transitions (slide left/right) | 15m |
| **Team page** | Agent list table, role badges, status indicators | 30m |
| **Mock data: templates + campaigns** | 12 templates, 8 campaigns, 5 segments | 30m |

**Day 3 Demo Checkpoint:** Create template → fill all fields → see live WhatsApp preview → save. Create campaign → select audience (see count) → select template → fill variables → review → schedule. View campaign analytics.

---

### Day 4: Polish + E2E + Docs + Deploy

**Goal:** Production-quality demo. All edge states handled. Deployed to Vercel. Documentation complete.

| Task | Files/Components | Est. Time |
|---|---|---|
| **Automation page** (basic) | React Flow canvas with 3 node types (Trigger, Condition, Action), read-only demo workflow | 1.5h |
| **All empty states** | Implement every empty state from §6.3 | 30m |
| **All loading skeletons** | Verify every route has `loading.tsx` with appropriate skeletons | 30m |
| **Error boundaries** | Verify every route has `error.tsx` with retry | 15m |
| **Dark mode audit** | Check every component in dark mode, fix contrast issues | 30m |
| **Keyboard navigation** | Tab order, focus rings, escape to close, ⌘K search | 30m |
| **Responsive spot-check** | Verify at 1024px, 1280px, 1440px widths (CRM is desktop-first) | 30m |
| **E2E tests** | 5 Playwright flows from §10.2 | 1.5h |
| **Unit/integration tests** | Critical paths: Zod schemas, formatters, form submissions | 1h |
| **Bundle analysis** | Run `@next/bundle-analyzer`, verify budget | 15m |
| **Documentation** | `README.md`, `DELIVERABLES.md`, `MOCK_VS_API.md`, `DEMO_SCRIPT.md` | 1h |
| **Vercel deploy** | Production deploy, verify preview URL, env vars | 15m |
| **Demo rehearsal** | Walk through 5-minute demo script, note any issues | 15m |

**Day 4 Demo Checkpoint:** Full end-to-end demo: Dashboard → Inbox → send message → Contacts → add contact → Templates → create template → Campaigns → create campaign → Automation (view-only). All screens polished, dark mode works, loading states visible on throttled network.

---

## Zustand Store Definitions

```typescript
// lib/stores/uiStore.ts
interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  activeModule: string;             // "dashboard" | "inbox" | "contacts" | ...
  setActiveModule: (module: string) => void;
}

// lib/stores/conversationStore.ts
interface ConversationStore {
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  customerSidebarOpen: boolean;
  toggleCustomerSidebar: () => void;
  inboxFilters: {
    status: ConversationStatus | "all";
    search: string;
    assignedTo: string | "all";
  };
  setInboxFilters: (filters: Partial<ConversationStore["inboxFilters"]>) => void;
}

// lib/stores/campaignWizardStore.ts
interface CampaignWizardStore {
  currentStep: number;
  setStep: (step: number) => void;
  wizardData: Partial<CreateCampaignInput>;
  updateWizardData: (data: Partial<CreateCampaignInput>) => void;
  resetWizard: () => void;
}
```

---

## Quick Reference: File → Responsibility Map

```
src/
├── app/                          → Routing, layouts, page-level data loading
├── components/
│   ├── ui/                       → Shadcn primitives (DON'T modify heavily)
│   ├── crm/                      → WhatsApp/CRM domain components
│   └── shared/                   → Reusable layout + data display components
├── lib/
│   ├── api/                      → Fetcher functions (THE swap point for mock → real)
│   ├── mock-data/                → Fabricated demo data (remove when going live)
│   ├── stores/                   → Zustand stores (UI state only)
│   ├── hooks/                    → Custom React hooks (useDebounce, useMediaQuery, etc.)
│   ├── validators/               → Zod schemas (shared between client + future server)
│   ├── types/                    → TypeScript interfaces (shared across app)
│   ├── utils/                    → cn(), formatPhone(), formatRelativeTime(), etc.
│   ├── auth/                     → Mock AuthContext + role guards
│   ├── motion.ts                 → Framer Motion presets (centralized)
│   ├── logger.ts                 → Structured logging utility
│   └── providers/                → QueryProvider, ThemeProvider composition
├── styles/
│   └── globals.css               → Tailwind v4 @theme tokens + base styles
├── __tests__/                    → Test files mirroring src/ structure
└── e2e/                          → Playwright E2E tests
```

---

> [!IMPORTANT]
> **This blueprint is designed to be executed sequentially.** Day 1 outputs are dependencies for Day 2. The mock data layer (§2.2, §3.2) is the critical path — if fetchers and types are solid on Day 1, Days 2-3 are pure UI work with zero data ambiguity.

**Ready to scaffold. Awaiting green light.** 🚀
