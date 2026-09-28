# WhatsApp CRM — Antigravity IDE Prompt Playbook
**38 Sequential Prompts | 4-Day Sprint | Copy-Paste Ready**

---

## How to Use This Playbook

1. **Execute prompts in order** — each prompt depends on outputs from previous prompts
2. **Copy the entire prompt block** (inside the fenced code block) and paste into Antigravity IDE
3. **Wait for completion** before moving to the next prompt
4. **Verify the checkpoint** at each day boundary before proceeding
5. Prompts marked with 🔑 are **critical path** — do not skip

> [!IMPORTANT]
> Every prompt references the project directory `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`. All file paths within prompts are relative to `src/` inside that project root.

---

## Pre-Build: Project Scaffold

### Prompt 0.1 — 🔑 Initialize Next.js Project

```
You are a Senior Frontend Engineer. Initialize a new Next.js 15 project with App Router in the current workspace directory `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Requirements:
- Use `npx -y create-next-app@latest ./` with these flags: --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
- If prompted interactively, select: TypeScript=Yes, ESLint=Yes, Tailwind CSS=Yes, src/ directory=Yes, App Router=Yes, Turbopack=Yes, import alias=@/*
- After scaffolding, install ALL of these dependencies in a single pnpm install command:
  
  Production deps:
  zustand @tanstack/react-query @tanstack/react-table react-hook-form @hookform/resolvers zod recharts framer-motion dayjs lucide-react next-themes sonner class-variance-authority clsx tailwind-merge

  Dev deps:
  @types/node prettier eslint-config-prettier

- Set up TypeScript strict mode in tsconfig.json: set "strict": true, "noUncheckedIndexedAccess": true
- Create a `.prettierrc` file with: semi: true, singleQuote: false, tabWidth: 2, trailingComma: "all", printWidth: 100
- Create a `.env.local` file with:
  NEXT_PUBLIC_APP_ENV=development
  NEXT_PUBLIC_API_MODE=mock
  NEXT_PUBLIC_APP_URL=http://localhost:3000
- Verify the project starts with `pnpm dev` (just check it compiles, then stop)

Do NOT modify any page content yet — just get the skeleton running with zero errors.
```

---

### Prompt 0.2 — 🔑 Initialize Shadcn UI + Install Base Components

```
You are a Senior Frontend Engineer working on the WhatsApp CRM project at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Initialize Shadcn UI and install all required base components:

1. Run `npx -y shadcn@latest init` with these options:
   - Style: New York
   - Base color: Neutral
   - CSS variables: Yes
   - Components location: @/components/ui
   
2. After init, install ALL of these Shadcn components (run as a single command):
   npx -y shadcn@latest add button input select dialog sheet card badge avatar tabs command tooltip skeleton dropdown-menu table scroll-area separator popover calendar checkbox switch textarea label form alert toast sonner

3. Create the utility function file `src/lib/utils.ts` if not already created by Shadcn. It should export:
   - `cn()` function using clsx + tailwind-merge
   - `formatPhone(phone: string): string` — formats E.164 to display format (e.g., +91 98765 43210)
   - `formatRelativeTime(date: string): string` — uses dayjs for relative time ("2m ago", "Yesterday 3:42 PM", "Sep 15")
   - `delay(min?: number, max?: number): Promise<void>` — random delay between min-max ms for mock API simulation
   - `generateId(prefix: string): string` — generates IDs like "contact_a1b2c3"

4. Verify Shadcn is working by confirming `@/components/ui/button.tsx` exists and imports resolve.

Do not create any pages or layouts yet.
```

---

## Day 1: Foundation + Dashboard

### Prompt 1.1 — 🔑 TypeScript Types & Interfaces

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create the complete TypeScript type system in `src/lib/types/index.ts`. Export ALL of the following as named exports:

UNION TYPES (export each as `export type`):
- MessageDirection: "inbound" | "outbound"
- MessageType: "text" | "image" | "video" | "document" | "audio" | "template" | "interactive" | "location" | "contact"
- MessageStatus: "sending" | "sent" | "delivered" | "read" | "failed"
- ConversationStatus: "open" | "pending" | "resolved" | "expired"
- ConversationChannel: "whatsapp"
- ContactStatus: "active" | "inactive" | "blocked"
- TemplateStatus: "draft" | "pending" | "approved" | "rejected" | "paused"
- TemplateCategory: "marketing" | "utility" | "authentication"
- TemplateHeaderType: "none" | "text" | "image" | "video" | "document"
- TemplateButtonType: "quick_reply" | "url" | "phone" | "copy_code"
- CampaignStatus: "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed"
- AgentRole: "admin" | "manager" | "agent"
- AgentStatus: "online" | "away" | "offline"
- ActivityType: "message_sent" | "message_received" | "tag_added" | "tag_removed" | "note_added" | "assigned" | "status_changed" | "campaign_sent" | "contact_created" | "contact_updated"
- SegmentOperator: "is" | "is_not" | "contains" | "not_contains" | "gt" | "lt" | "between" | "in" | "not_in"
- SegmentConjunction: "and" | "or"

INTERFACES (export each):
- Contact: { id, phone (E.164), name, email?, avatarUrl?, status: ContactStatus, tags: Tag[], customAttributes: Record<string, string|number|boolean>, assignedAgentId?, optInStatus, optInTimestamp?, lastMessageAt?, createdAt, updatedAt }
- Conversation: { id, contactId, contact: Contact, channel: ConversationChannel, status: ConversationStatus, assignedAgentId?, assignedAgent?: Agent, lastMessage?: Message, unreadCount, tags: Tag[], priority: "low"|"medium"|"high", windowExpiresAt?, createdAt, updatedAt }
- Message: { id, conversationId, direction: MessageDirection, type: MessageType, content: MessageContent, status: MessageStatus, senderType: "contact"|"agent"|"system"|"bot", senderId?, templateId?, replyToMessageId?, timestamp, metadata?: { waMessageId?, errorCode?, errorMessage? } }
- MessageContent: { text?, caption?, mediaUrl?, mediaMimeType?, fileName?, latitude?, longitude?, templateName?, templateVariables?: Record<string,string>, buttons?: Array<{id,title}> }
- Template: { id, name (snake_case), displayName, category: TemplateCategory, language, status: TemplateStatus, header?: { type: TemplateHeaderType, text?, mediaUrl?, variables?: string[] }, body: { text, variables?: string[], examples?: string[] }, footer?: { text }, buttons?: TemplateButton[], rejectionReason?, qualityScore?: "green"|"yellow"|"red"|"unknown", usageCount, lastUsedAt?, createdAt, updatedAt }
- TemplateButton: { type: TemplateButtonType, text, url?, phoneNumber?, example? }
- Campaign: { id, name, status: CampaignStatus, templateId, template?: Template, segmentId?, segment?: Segment, audienceCount, scheduledAt?, sentAt?, completedAt?, stats: CampaignStats, createdById, createdAt, updatedAt }
- CampaignStats: { total, sent, delivered, read, replied, failed, clicked }
- Segment: { id, name, description?, filters: SegmentFilter[], conjunction: SegmentConjunction, estimatedCount, createdAt, updatedAt }
- SegmentFilter: { id, field, operator: SegmentOperator, value: string|number|string[] }
- Agent: { id, name, email, avatarUrl?, role: AgentRole, status: AgentStatus, activeConversations, maxConversations, departments: string[], lastActiveAt?, createdAt }
- Tag: { id, name, color }
- Activity: { id, contactId, type: ActivityType, description, metadata?: Record<string,unknown>, performedById?, performedBy?: Agent, timestamp }
- Note: { id, contactId, content, createdById, createdBy?: Agent, isPinned, createdAt, updatedAt }

API RESPONSE SHAPES:
- PaginatedResponse<T>: { data: T[], pagination: { page, pageSize, total, totalPages, hasNext, hasPrevious } }
- ApiResponse<T>: { data: T, success, message? }
- ApiError: { code, message, details?: Record<string, string[]> }
- DashboardMetrics: { totalContacts, activeConversations, messagesToday, responseTime: { average, median, p95 }, messageVolume: Array<{ date, sent, received }>, deliveryFunnel: { sent, delivered, read, replied, failed }, campaignPerformance: Array<{ campaignId, name, stats: CampaignStats }>, agentPerformance: Array<{ agentId, name, resolved, avgResponseTime, satisfaction }>, topTemplates: Array<{ templateId, name, sentCount, deliveryRate, readRate }> }

FILTER TYPES:
- ContactFilters: { page, pageSize, search?, status?, tags?: string[], sortBy?, sortOrder?: "asc"|"desc" }
- ConversationFilters: { status?: ConversationStatus|"all", search?, assignedTo?: string|"all" }
- TemplateFilters: { status?: TemplateStatus, category?: TemplateCategory, search? }
- CampaignFilters: { status?: CampaignStatus, search?, dateRange?: { from: string, to: string } }

INPUT TYPES:
- CreateContactInput, UpdateContactInput (Partial<CreateContactInput>)
- SendMessageInput: { type: MessageType, content: MessageContent }
- CreateTemplateInput, UpdateTemplateInput
- CreateCampaignInput: { name, segmentId?, templateId, variables?: Record<string,string>, scheduleType: "now"|"later", scheduledAt? }

Use `export` for all types/interfaces. All date fields are ISO 8601 strings. All IDs are strings.
```

---

### Prompt 1.2 — 🔑 Complete Mock Data Generation

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create the complete mock data layer. All files import types from `@/lib/types`. Use realistic data (Indian names, +91 phone numbers, realistic CRM scenarios). All IDs use deterministic format: `{entity}_{001}`, `{entity}_{002}`, etc.

Create these files:

1. `src/lib/mock-data/tags.ts` — Export `mockTags`: 15 tags with colors. Examples: "VIP" (#EAB308), "New Lead" (#3B82F6), "Hot" (#EF4444), "Paid" (#22C55E), "Churned" (#6B7280), "Enterprise" (#8B5CF6), "Support" (#F59E0B), "Demo Booked" (#06B6D4), "Follow Up" (#F97316), "Onboarding" (#EC4899), "Inactive" (#9CA3AF), "Referred" (#14B8A6), "Priority" (#DC2626), "Partner" (#7C3AED), "Trial" (#2563EB)

2. `src/lib/mock-data/agents.ts` — Export `mockAgents`: 6 agents. Mix of admin (1), manager (1), agent (4). Varied statuses (online/away/offline). Indian names. Active conversation counts between 2-15. Max conversations 20.

3. `src/lib/mock-data/contacts.ts` — Export `mockContacts`: 50 contacts. Indian names and +91 phone numbers. Mix of statuses (active 40, inactive 7, blocked 3). Each has 1-4 tags from mockTags. Some have customAttributes like { plan: "premium", company: "TechCorp" }. Timestamps spanning last 90 days. Some have assignedAgentId.

4. `src/lib/mock-data/conversations.ts` — Export `mockConversations`: 25 conversations. Reference contactIds and agentIds from other mock files. Mix of statuses (open 12, pending 5, resolved 6, expired 2). Unread counts 0-15. Each has a lastMessage preview. Some have tags. Priority distribution: low 15, medium 7, high 3. WindowExpiresAt for open ones.

5. `src/lib/mock-data/messages.ts` — Export `mockMessages`: A Record<string, Message[]> keyed by conversationId. At least 8-15 messages per conversation (200+ total). Mix of text (70%), image (10%), document (5%), template (10%), system (5%). Realistic conversation flows (greeting → inquiry → response → resolution). Varied statuses. Timestamps in logical sequence within each conversation.

6. `src/lib/mock-data/templates.ts` — Export `mockTemplates`: 12 templates. Categories: marketing (5), utility (5), authentication (2). Statuses: approved (7), pending (3), rejected (1), draft (1). Include body variables like "Hello {{1}}, your order {{2}} is {{3}}". Some have buttons (quick_reply, url). Some have headers (text, image). Languages: en_US (10), hi (2). Usage counts 0-5000.

7. `src/lib/mock-data/campaigns.ts` — Export `mockCampaigns`: 8 campaigns. Statuses: sent (3), scheduled (2), draft (2), failed (1). Reference templateIds. Realistic stats (total matches audienceCount, sent ≤ total, delivered ≤ sent, read ≤ delivered, etc). Audience counts 500-5000.

8. `src/lib/mock-data/segments.ts` — Export `mockSegments`: 5 segments. Examples: "All Active Users" (filter: status is active), "VIP Customers" (filter: tag in [vip, enterprise]), "Inactive 30 Days" (filter: lastMessageAt lt 30d ago), "Trial Users" (filter: customAttr.plan is trial), "New Leads This Week" (filter: createdAt gt 7d ago). Each with estimatedCount.

9. `src/lib/mock-data/activities.ts` — Export `mockActivities`: A Record<string, Activity[]> keyed by contactId. 3-8 activities per contact for the first 15 contacts. Types: message_sent, tag_added, note_added, assigned, status_changed. Chronological order.

10. `src/lib/mock-data/notes.ts` — Export `mockNotes`: A Record<string, Note[]> keyed by contactId. 1-4 notes for the first 20 contacts. Some pinned. Created by various agents.

11. `src/lib/mock-data/dashboard.ts` — Export `mockDashboardMetrics`: DashboardMetrics object with realistic numbers. messageVolume for last 14 days. deliveryFunnel: sent=15420, delivered=14890, read=12340, replied=3250, failed=530. 5 campaignPerformance entries. 6 agentPerformance entries. 5 topTemplates.

12. `src/lib/mock-data/index.ts` — Re-export everything. Also export the `delay()` helper and a `resetDemoData()` function stub.

All cross-references must be consistent: conversation.contactId must match an existing contact.id, conversation.assignedAgentId must match an agent.id, etc.
```

---

### Prompt 1.3 — 🔑 API Fetcher Layer + Query Keys

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create the complete API fetcher layer with mock implementations. All fetchers import types from `@/lib/types` and mock data from `@/lib/mock-data`. Every fetcher function is async and uses `await delay(200, 600)` before returning to simulate network latency.

Create these files:

1. `src/lib/api/queryKeys.ts` — Export `queryKeys` object using the factory pattern:
   - dashboard: { all, metrics() }
   - contacts: { all, lists(), list(filters), details(), detail(id), activities(id), notes(id) }
   - conversations: { all, lists(), list(filters), details(), detail(id), messages(id, page?) }
   - templates: { all, lists(), list(filters?), detail(id) }
   - campaigns: { all, lists(), list(filters?), detail(id) }
   - segments: { all, list(), detail(id), estimate(filters) }
   - agents: { all, list(), detail(id) }
   - tags: { all, list() }
   Each level spreads from parent using `as const` for type safety.

2. `src/lib/api/dashboard.ts`:
   - fetchDashboardMetrics() → ApiResponse<DashboardMetrics>

3. `src/lib/api/contacts.ts`:
   - fetchContacts(filters: ContactFilters) → PaginatedResponse<Contact> — implement filtering by search (name/phone), status, tags. Implement sorting. Implement pagination.
   - fetchContact(id) → ApiResponse<Contact>
   - createContact(data: CreateContactInput) → ApiResponse<Contact> — generate new ID, add to mock array
   - updateContact(id, data) → ApiResponse<Contact>
   - deleteContact(id) → ApiResponse<void>
   - addContactTag(contactId, tagId) → ApiResponse<Contact>
   - removeContactTag(contactId, tagId) → ApiResponse<Contact>
   - fetchContactActivities(contactId) → ApiResponse<Activity[]>
   - fetchContactNotes(contactId) → ApiResponse<Note[]>
   - createNote(contactId, content) → ApiResponse<Note>

4. `src/lib/api/conversations.ts`:
   - fetchConversations(filters: ConversationFilters) → PaginatedResponse<Conversation> — filter by status, search (contact name), assignedTo
   - fetchConversation(id) → ApiResponse<Conversation>
   - fetchMessages(conversationId, page?) → PaginatedResponse<Message> — reverse chronological, 20 per page
   - sendMessage(conversationId, data: SendMessageInput) → ApiResponse<Message> — create new message, update conversation.lastMessage
   - assignConversation(conversationId, agentId) → ApiResponse<Conversation>
   - updateConversationStatus(conversationId, status) → ApiResponse<Conversation>

5. `src/lib/api/templates.ts`:
   - fetchTemplates(filters?) → PaginatedResponse<Template>
   - fetchTemplate(id) → ApiResponse<Template>
   - createTemplate(data) → ApiResponse<Template> — status defaults to "draft"
   - updateTemplate(id, data) → ApiResponse<Template>
   - deleteTemplate(id) → ApiResponse<void>

6. `src/lib/api/campaigns.ts`:
   - fetchCampaigns(filters?) → PaginatedResponse<Campaign>
   - fetchCampaign(id) → ApiResponse<Campaign>
   - createCampaign(data: CreateCampaignInput) → ApiResponse<Campaign>
   - scheduleCampaign(id, scheduledAt) → ApiResponse<Campaign>
   - cancelCampaign(id) → ApiResponse<Campaign>

7. `src/lib/api/segments.ts`:
   - fetchSegments() → ApiResponse<Segment[]>
   - estimateAudienceCount(filters: SegmentFilter[]) → ApiResponse<{ count: number }> — returns random count 100-5000

8. `src/lib/api/agents.ts`:
   - fetchAgents() → ApiResponse<Agent[]>
   - updateAgentStatus(id, status) → ApiResponse<Agent>

9. `src/lib/api/tags.ts`:
   - fetchTags() → ApiResponse<Tag[]>

Mock implementations should operate on in-memory copies of mock data arrays so mutations (create/update/delete) persist during the session.
```

---

### Prompt 1.4 — TanStack Query Provider + Auth Provider

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create the provider infrastructure:

1. `src/lib/providers/QueryProvider.tsx` — "use client" component:
   - Create QueryClient with defaults: staleTime 5min, gcTime 30min, retry 2, exponential retryDelay (min 1s, max 10s), refetchOnWindowFocus false, mutations retry 1
   - Wrap children in QueryClientProvider
   - Include ReactQueryDevtools (lazy import from '@tanstack/react-query-devtools') in development only

2. `src/lib/auth/AuthContext.tsx` — "use client" component:
   - Define AuthUser interface: { id, name, email, role: AgentRole, avatarUrl? }
   - Create AuthContext with React.createContext
   - Create AuthProvider that provides a hardcoded mock admin user: { id: "agent_001", name: "Arjun Mehta", email: "arjun@mindclub.com", role: "admin", avatarUrl: undefined }
   - Export `useAuth()` hook that returns the current user from context, throws if used outside provider

3. `src/lib/providers/AppProviders.tsx` — "use client" component:
   - Compose all providers in correct order: QueryProvider → ThemeProvider (from next-themes, attribute="class", defaultTheme="system", enableSystem) → AuthProvider → children
   - Add Toaster from sonner at the end (position: "top-right", richColors, closeButton)

4. Update `src/app/layout.tsx`:
   - Import Inter font from next/font/google
   - Wrap {children} with AppProviders
   - Set metadata: title "WhatsApp CRM", description "WhatsApp Business CRM Platform"
   - Apply Inter font className to <body>
   - Add suppressHydrationWarning to <html> (required by next-themes)

Ensure all providers are "use client" components. The root layout.tsx itself should NOT be a client component — only the providers wrapper is.
```

---

### Prompt 1.5 — Zustand Stores

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create the Zustand stores:

1. `src/lib/stores/uiStore.ts`:
   - sidebarCollapsed: boolean (default false)
   - toggleSidebar: () => void
   - commandOpen: boolean (default false)
   - setCommandOpen: (open: boolean) => void
   - activeModule: string (default "dashboard")
   - setActiveModule: (module: string) => void
   Export as `useUIStore`

2. `src/lib/stores/conversationStore.ts`:
   - activeConversationId: string | null (default null)
   - setActiveConversation: (id: string | null) => void
   - customerSidebarOpen: boolean (default true)
   - toggleCustomerSidebar: () => void
   - inboxFilters: { status: ConversationStatus | "all" (default "all"), search: string (default ""), assignedTo: string | "all" (default "all") }
   - setInboxFilters: (filters: Partial<inboxFilters>) => void — shallow merge
   - resetFilters: () => void
   Export as `useConversationStore`

3. `src/lib/stores/campaignWizardStore.ts`:
   - currentStep: number (default 0)
   - setStep: (step: number) => void
   - wizardData: Partial<CreateCampaignInput> (default {})
   - updateWizardData: (data: Partial<CreateCampaignInput>) => void — shallow merge
   - resetWizard: () => void — reset all to defaults
   Export as `useCampaignWizardStore`

Import types from `@/lib/types`. Use `create` from zustand. Use the immer middleware for conversationStore filters (or manual spread — your choice, but be consistent). Do NOT use persist middleware — all state is ephemeral.
```

---

### Prompt 1.6 — Theming + Global CSS

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Update `src/app/globals.css` (or `src/styles/globals.css` — use whichever exists) to include:

1. Keep all existing Shadcn/Tailwind base imports and CSS variable definitions

2. Add WhatsApp CRM custom theme tokens as CSS custom properties in :root and .dark:

   :root {
     --whatsapp: #25D366;
     --whatsapp-dark: #128C7E;
     --whatsapp-light: #DCF8C6;
     --whatsapp-teal: #075E54;
     --bubble-outbound: #DCF8C6;
     --bubble-inbound: #FFFFFF;
     --success: #22C55E;
     --warning: #F59E0B;
     --error: #EF4444;
     --info: #3B82F6;
   }

   .dark {
     --bubble-outbound: #005C4B;
     --bubble-inbound: #1F2937;
   }

3. Add utility classes:
   - `.bubble-outbound` { background-color: var(--bubble-outbound) }
   - `.bubble-inbound` { background-color: var(--bubble-inbound) }
   - Reduced motion media query: @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
   - Custom scrollbar styles for the chat area (thin, subtle)
   - `.typing-dot` animation for the typing indicator (3 bouncing dots)

4. Import Google Font 'Inter' with weights 400, 500, 600, 700 (if not already loaded via next/font)

Keep it clean. Don't remove any existing Shadcn variable definitions.
```

---

### Prompt 1.7 — Framer Motion Presets + Logger

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create two utility files:

1. `src/lib/motion.ts` — Centralized Framer Motion animation presets. Export `motionConfig` object with:
   - bubbleEnter: { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2, ease: "easeOut" } }
   - sheetSlide: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 } }
   - wizardStep: { enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (direction: number) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }), transition: { duration: 0.3, ease: "easeInOut" } }
   - fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
   - scaleIn: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.15 } }
   
   Also export a `useReducedMotion()` wrapper hook that checks `prefers-reduced-motion` and returns static values when true.

2. `src/lib/logger.ts` — Structured logging utility. Export `logger` object:
   - info(msg, data?) — console.info with [INFO] prefix, dev-only
   - warn(msg, data?) — console.warn with [WARN] prefix, always
   - error(msg, error?) — console.error with [ERROR] prefix, always. Include a TODO comment for Sentry integration
   - query(key, status) — console.debug with [Query] prefix, dev-only
   Check `process.env.NEXT_PUBLIC_APP_ENV === "production"` to suppress dev-only logs.
```

---

### Prompt 1.8 — 🔑 App Shell: Sidebar + TopBar + CRM Layout

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the CRM app shell — this is the persistent layout that wraps all CRM pages.

1. `src/components/shared/Sidebar.tsx` — "use client":
   - Collapsible sidebar (controlled by useUIStore.sidebarCollapsed)
   - Width: 260px expanded, 72px collapsed, smooth transition
   - Top: Logo area with WhatsApp CRM branding + collapse toggle button
   - Navigation items using Lucide icons + labels:
     • Dashboard (LayoutDashboard icon) → /dashboard
     • Inbox (MessageSquare icon) → /inbox — show unread count badge
     • Contacts (Users icon) → /contacts
     • Templates (FileText icon) → /templates
     • Campaigns (Send icon) → /campaigns
     • Team (UserCog icon) → /team
     • Automation (GitBranch icon) → /automation
     • Settings (Settings icon) → /settings
   - Active state: highlighted background + accent color on active route (use usePathname())
   - Bottom: "DEMO DATA" badge in yellow, user avatar + name from useAuth()
   - Collapsed state: only shows icons with tooltips
   - Dark mode compatible with proper contrast
   - Keyboard navigation: Tab through items, Enter to activate, aria-current="page" on active

2. `src/components/shared/TopBar.tsx` — "use client":
   - Height: 56px, sticky top-0
   - Left: Breadcrumb navigation (auto-generated from pathname segments)
   - Center: Global search trigger button (Cmd+K / Ctrl+K shortcut hint)
   - Right: Theme toggle (sun/moon icon using next-themes), notification bell (placeholder), user avatar dropdown (Shadcn DropdownMenu with: Profile, Settings, Sign Out)
   - When Cmd+K is pressed, open Shadcn Command dialog (controlled by useUIStore.commandOpen)

3. `src/components/shared/CommandSearch.tsx` — "use client":
   - Shadcn Command component that opens with ⌘K
   - Search across: pages (Dashboard, Inbox, etc.), recent conversations (mock), contacts (mock)
   - Navigate to selected item using Next.js router
   - Close on Escape or selection

4. `src/app/(crm)/layout.tsx`:
   - Flex layout: Sidebar (left) + main content area (right)
   - Main area: TopBar (sticky) + page content with overflow-y-auto
   - Full height: h-screen with flex
   - Apply appropriate padding/margins

5. `src/app/page.tsx` — Redirect to /dashboard using `redirect()` from next/navigation

6. `src/app/(auth)/layout.tsx` — Minimal centered layout (for future login page)
7. `src/app/(auth)/login/page.tsx` — Simple "Login" placeholder page

Design aesthetic: Clean, modern CRM feel. Dark sidebar background (slate-900) with light text. Subtle hover effects on navigation items. The sidebar should feel premium — like HubSpot or Intercom.

Make sure the shell is responsive down to 1024px width (sidebar auto-collapses below 1280px).
```

---

### Prompt 1.9 — Shared Reusable Components

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the shared reusable components. Each should be a well-typed "use client" component with proper props interface:

1. `src/components/shared/PageHeader.tsx`:
   - Props: title (string), description? (string), actions? (ReactNode)
   - Layout: title as h1, description as p below, actions aligned right
   - Bottom border separator

2. `src/components/shared/SearchBar.tsx`:
   - Props: value, onChange, placeholder, debounceMs (default 300), className?
   - Search icon (Lucide Search) on left, clear button (X) when has value
   - Internal debounce using useEffect + setTimeout

3. `src/components/shared/EmptyState.tsx`:
   - Props: icon (LucideIcon), title, description, actionLabel?, onAction?, className?
   - Centered layout: icon (48px, muted), title, description, optional action button
   - Subtle fade-in animation using motionConfig.fadeIn

4. `src/components/shared/ConfirmDialog.tsx`:
   - Props: open, onOpenChange, title, description, onConfirm, confirmLabel (default "Confirm"), destructive? (default false), loading?
   - Uses Shadcn AlertDialog
   - Destructive variant uses red button

5. `src/components/shared/Stepper.tsx`:
   - Props: steps: Array<{ title, description? }>, currentStep, onStepClick?
   - Horizontal stepper with circles, connecting lines
   - States: completed (green check), current (primary color, pulse), upcoming (gray)
   - Clickable steps if onStepClick provided (only for completed + current steps)

6. `src/components/crm/StatusBadge.tsx`:
   - Props: status (string), variant: "conversation" | "template" | "campaign" | "agent"
   - Color mapping per variant:
     • conversation: open=green, pending=yellow, resolved=gray, expired=red
     • template: approved=green, pending=yellow, rejected=red, draft=gray, paused=orange
     • campaign: sent=green, scheduled=blue, draft=gray, sending=yellow, paused=orange, failed=red
     • agent: online=green, away=yellow, offline=gray
   - Uses Shadcn Badge with dot indicator

7. `src/components/crm/MetricCard.tsx`:
   - Props: title, value (number), change? (number), changeType? ("up"|"down"), icon (LucideIcon), loading? (boolean), prefix? (string), suffix? (string)
   - Shadcn Card with icon, title, large value number
   - Change indicator: green arrow up or red arrow down with percentage
   - Loading state: Skeleton replacing value area
   - Animate number count-up on mount using Framer Motion (optional, respect reduced motion)

8. `src/components/shared/DataTable.tsx` — Generic data table using TanStack Table + Shadcn Table:
   - Props: columns (ColumnDef[]), data, pagination? (enable/disable), sorting? (enable/disable), filtering?, selection? (enable/disable), onRowClick?, searchKey? (for column search), emptyMessage?
   - Features: column sorting (click header), row selection (checkbox column), pagination controls (prev/next, page size selector, "Showing X of Y"), search input when searchKey provided
   - Uses Shadcn Table, Button, Select components
   - Export helper: `createColumnHelper<T>()` for type-safe column definitions

All components must:
- Be properly typed with TypeScript
- Support className prop for style overrides via cn()
- Use Shadcn components where applicable
- Follow the component patterns from the existing ui/ components
```

---

### Prompt 1.10 — 🔑 Dashboard Page

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the complete Dashboard page at `src/app/(crm)/dashboard/page.tsx`.

Create the following components and compose them on the dashboard page:

1. `src/components/dashboard/DashboardKPIs.tsx` — "use client":
   - 4 MetricCard components in a responsive grid (4 cols on xl, 2 on md, 1 on sm):
     • Total Contacts — Users icon, value from metrics.totalContacts
     • Active Conversations — MessageSquare icon, value from metrics.activeConversations
     • Messages Today — Send icon, value from metrics.messagesToday
     • Avg Response Time — Clock icon, value from metrics.responseTime.average, suffix "min"
   - Each card shows a mock % change (hardcode realistic values like +12.5%, -3.2%)
   - Use `useQuery` with queryKeys.dashboard.metrics() to fetch data

2. `src/components/dashboard/MessageVolumeChart.tsx` — "use client":
   - Recharts BarChart showing sent vs received messages per day
   - Data from metrics.messageVolume (14 days)
   - Two bars per day: sent (indigo), received (emerald)
   - Custom tooltip with date + values
   - Responsive container, card wrapper with title "Message Volume"

3. `src/components/dashboard/DeliveryFunnelChart.tsx` — "use client":
   - Recharts horizontal BarChart or FunnelChart showing: Sent → Delivered → Read → Replied → Failed
   - Use metrics.deliveryFunnel
   - Color gradient from blue → green → yellow → orange → red (for failed)
   - Card wrapper with title "Delivery Funnel"

4. `src/components/dashboard/CampaignPerformanceChart.tsx` — "use client":
   - Recharts PieChart/DonutChart showing campaign performance breakdown
   - Use metrics.campaignPerformance (top 5 campaigns)
   - Legend below chart
   - Card wrapper with title "Campaign Performance"

5. `src/components/dashboard/RecentConversationsTable.tsx` — "use client":
   - Simple table showing 5 most recent conversations
   - Columns: Contact name + avatar, Last message (truncated), Status badge, Time
   - Row click → navigate to /inbox (with that conversation selected)
   - Card wrapper with title "Recent Conversations" + "View All" link to /inbox

6. `src/components/dashboard/AgentPerformanceTable.tsx` — "use client":
   - Table showing agent performance
   - Columns: Agent name + avatar, Resolved count, Avg response time, Satisfaction (as progress bar)
   - Card wrapper with title "Agent Performance"

7. `src/components/dashboard/TopTemplatesTable.tsx` — "use client":
   - Table showing top 5 templates
   - Columns: Template name, Sent count, Delivery rate (%), Read rate (%)
   - Card wrapper with title "Top Templates"

Dashboard page layout:
- PageHeader: "Dashboard" title, "Overview of your WhatsApp CRM performance" description
- DateRangePicker in the actions slot (placeholder — just visual, doesn't filter yet)
- KPI cards row
- Two charts side by side (MessageVolume + DeliveryFunnel)
- Campaign donut chart + Recent conversations side by side
- Agent performance + Top templates side by side
- All data fetched via TanStack Query from mock API

Design: Modern, clean dashboard with subtle card shadows, proper spacing (gap-6). Charts should have proper colors matching the theme. Ensure dark mode compatibility for all charts (text color, grid lines, tooltips).
```

---

### Prompt 1.11 — Dashboard Loading + Error States

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create the loading and error states for the dashboard:

1. `src/app/(crm)/dashboard/loading.tsx`:
   - 4 Skeleton cards in a grid (matching KPI card dimensions)
   - 2 large Skeleton rectangles side by side (chart placeholders)
   - 2 more Skeleton rectangles side by side (tables)
   - Maintain exact same layout grid as the real dashboard page

2. `src/app/(crm)/dashboard/error.tsx` — "use client":
   - Error boundary component (receives error and reset props)
   - Display: error icon, "Dashboard Error" title, error.message, "Try Again" button calling reset()
   - Centered layout with card wrapper

3. `src/app/error.tsx` — "use client" — Global error boundary:
   - Full page centered error state
   - Large error icon, "Something went wrong" title, error.message
   - Two buttons: "Try Again" (calls reset) and "Go Home" (navigates to /dashboard)

4. `src/app/not-found.tsx`:
   - Full page 404 with WhatsApp CRM branding
   - "Page not found" message + "Go to Dashboard" button

5. `src/app/loading.tsx`:
   - Full page loading spinner/skeleton as global fallback

Now run `pnpm dev` and verify:
- Navigating to / redirects to /dashboard
- Dashboard loads with KPI cards, charts, and tables showing mock data
- Sidebar navigation works (all links, active state highlights correctly)
- Dark mode toggle works
- ⌘K command search opens
- No TypeScript errors, no console errors
```

---

### Prompt 1.12 — Zod Validation Schemas

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create all Zod validation schemas that will be used by forms on Days 2-3:

1. `src/lib/validators/contact.ts`:
   - contactSchema: name (required, max 100), phone (E.164 regex: /^\+[1-9]\d{6,14}$/), email (optional, valid email or empty string), tags (array of strings, default []), customAttributes (record, default {}), optInStatus (boolean, default true)
   - Export type CreateContactInput = z.infer<typeof contactSchema>

2. `src/lib/validators/template.ts`:
   - templateButtonSchema: type (enum: quick_reply, url, phone, copy_code), text (required, max 25), url (optional, valid URL), phoneNumber (optional)
   - templateSchema: name (required, max 512, regex /^[a-z0-9_]+$/), displayName (required, max 200), category (enum), language (string 2-10), header (optional object: type enum, text? max 60, mediaUrl?), body (required: text min 1 max 1024, examples? array), footer (optional: text max 60), buttons (optional, array of templateButtonSchema, max 3)
   - Export type CreateTemplateInput

3. `src/lib/validators/campaign.ts`:
   - campaignStep1Schema: name (required, max 200)
   - campaignStep2Schema: segmentId (required)
   - campaignStep3Schema: templateId (required), variables (optional record)
   - campaignStep4Schema: scheduleType (enum: now, later), scheduledAt (optional). Refine: if scheduleType is "later", scheduledAt is required
   - Export all step schemas + full CreateCampaignInput type

4. `src/lib/validators/audience.ts`:
   - segmentFilterSchema: field (required), operator (enum of all SegmentOperator values), value (union: string, number, array of strings)
   - segmentSchema: name (required, max 100), description (optional, max 500), filters (array of segmentFilterSchema, min 1), conjunction (enum: and, or, default "and")

5. `src/lib/validators/message.ts`:
   - messageSchema: type (MessageType enum), content.text (required for text type, min 1, max 4096)

All schemas use Zod. Include descriptive error messages for every validation rule. Export the schemas AND their inferred TypeScript types.
```

---

## Day 2: Inbox + Contacts

### Prompt 2.1 — Conversation List Component

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the conversation list for the Inbox:

1. `src/components/inbox/ConversationRow.tsx` — "use client":
   - Props: conversation: Conversation, isActive: boolean, onClick: () => void
   - Layout: Avatar (Shadcn Avatar with initials fallback) | Name + last message preview (1 line truncated) | Timestamp (relative via formatRelativeTime) + unread badge
   - Unread badge: green circle with count (hidden when 0)
   - Active state: subtle primary-tinted background
   - Hover: slight background change
   - Status dot on avatar (green=open, yellow=pending, gray=resolved)
   - Priority indicator for "high" priority (small red dot or label)
   - Use Framer Motion layoutId for smooth reordering

2. `src/components/inbox/ConversationList.tsx` — "use client":
   - SearchBar at top (filters conversations by contact name, debounced)
   - Filter row: status filter (All, Open, Pending, Resolved) using Shadcn Tabs or ToggleGroup
   - Scrollable list of ConversationRow components
   - Active conversation highlighted (from useConversationStore.activeConversationId)
   - Click row → setActiveConversation(id)
   - Use `useQuery` with queryKeys.conversations.list(filters) to fetch
   - Filters from useConversationStore.inboxFilters
   - Empty state when no conversations match filters

3. `src/lib/hooks/useConversations.ts`:
   - Custom hook wrapping useQuery for conversation list
   - Auto-refetch on filter changes
   - Return { conversations, isLoading, isError, error }

Width: 350px fixed, full height, border-right separator. Scrollable with custom scrollbar.
```

---

### Prompt 2.2 — 🔑 Chat Window + Message Bubbles

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the core chat experience:

1. `src/components/inbox/MessageBubble.tsx` — "use client":
   - Props: message: Message, isLast?: boolean
   - Outbound (agent→contact): green bubble, aligned right, max-width 65%
   - Inbound (contact→agent): white/gray bubble, aligned left, max-width 65%
   - System messages: centered, gray italic text, no bubble
   - Content rendering by type:
     • text: plain text with line breaks preserved
     • image: thumbnail image (max 300×400px) with optional caption below
     • document: file chip (file icon + filename + "Download" text)
     • template: styled template preview (header + body with highlighted variables + footer + buttons)
   - Bottom-right of bubble: timestamp (HH:MM format using Day.js) + DeliveryTicks (outbound only)
   - Framer Motion: each bubble animates in using motionConfig.bubbleEnter (with AnimatePresence)
   - Dark mode: outbound=#005C4B, inbound=#1F2937
   - Bubble tail/arrow shape via CSS (like WhatsApp)

2. `src/components/inbox/DeliveryTicks.tsx`:
   - Props: status: MessageStatus
   - Rendering: sending=⏳ (clock), sent=single gray ✓, delivered=double gray ✓✓, read=double blue ✓✓, failed=red ❌
   - Use SVG or Unicode characters for ticks
   - Compact, inline display

3. `src/components/inbox/ChatWindow.tsx` — "use client":
   - Props: conversationId: string
   - Header bar: contact name + avatar, status badge, "Customer Info" toggle button (opens/closes customer sidebar)
   - Message area: scrollable, messages grouped by date (e.g., "Today", "Yesterday", "Sep 25")
   - Date separators: centered pill with date text
   - Auto-scroll to bottom on new messages and on conversation switch
   - Scroll-to-bottom FAB button when scrolled up
   - Uses `useQuery` with queryKeys.conversations.messages(conversationId)
   - TypingIndicator shown at bottom (randomly toggle for demo effect)
   - Empty state for conversation with no messages

4. `src/components/inbox/TypingIndicator.tsx`:
   - Three bouncing dots in a small inbound-style bubble
   - CSS-only animation (no Framer Motion — this is high frequency)
   - Shows "Contact is typing..." screen reader text

5. `src/components/inbox/ChatDateSeparator.tsx`:
   - Props: date: string
   - Centered pill: rounded-full bg-muted text-muted-foreground text-xs px-3 py-1

Chat area background: subtle WhatsApp-like pattern (optional — could be a very light repeating pattern or just plain background). Ensure proper contrast in both light and dark modes.
```

---

### Prompt 2.3 — Message Composer

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the message composer:

1. `src/components/inbox/MessageComposer.tsx` — "use client":
   - Props: conversationId: string, onSendMessage?: () => void
   - Layout: horizontal bar at bottom of chat window
     • Left: attachment button (Paperclip icon) — opens dropdown with: Image, Document, Video
     • Center: auto-growing textarea (min 1 row, max 5 rows). Placeholder "Type a message..."
     • Right: Send button (Send icon), disabled when text is empty
   - Template selector: small button/dropdown next to attachment that opens a popover listing approved templates. Clicking a template fills the message content with the template body text
   - Send behavior:
     • Click Send or press Enter (without Shift) to send
     • Shift+Enter for newline
     • On send: call sendMessage mutation (optimistic update), clear input, focus back to input
     • Use `useMutation` with optimistic update: append message to cache immediately, rollback on error
   - WhatsApp 24-hour window indicator: if conversation.windowExpiresAt is expired, show a yellow banner "24-hour window expired. You can only send templates." and disable free-text input, only allow template selection
   - Loading state: Send button shows spinner during mutation

2. `src/lib/hooks/useSendMessage.ts`:
   - Custom hook wrapping useMutation for sending messages
   - Optimistic update: append new message to queryKeys.conversations.messages(conversationId) cache
   - Also update queryKeys.conversations.list (update lastMessage preview)
   - On error: rollback, show toast notification
   - On success: invalidate conversation queries

Focus management: after sending, return focus to the textarea input.
```

---

### Prompt 2.4 — Customer Sidebar

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the customer detail sidebar that appears on the right side of the inbox:

1. `src/components/inbox/CustomerSidebar.tsx` — "use client":
   - Props: contactId: string
   - Appears to the right of the chat window when useConversationStore.customerSidebarOpen is true
   - Width: 320px, full height, border-left, scrollable
   - Animated slide-in from right using Framer Motion sheetSlide preset
   - Sections (vertically stacked, each in a card or with separator):

   Section 1 — Contact Header:
   - Avatar (large, 64px), name, phone number, email
   - Status badge (active/inactive/blocked)
   - "Edit Contact" button → navigates to /contacts/[contactId]

   Section 2 — Assignment:
   - "Assigned to" label + agent avatar/name
   - Dropdown to reassign (Select component listing all agents)
   - On change: call assignConversation mutation

   Section 3 — Tags:
   - TagInput component: shows current tags as colored pills
   - Add tag: combobox/autocomplete from available tags
   - Remove tag: X button on each pill
   - Mutations: addContactTag / removeContactTag with optimistic updates

   Section 4 — Notes:
   - List of notes (sorted by date, pinned first)
   - Each note: content, author name, relative timestamp, pin/unpin toggle
   - "Add Note" form at bottom: textarea + submit button
   - Use React Hook Form for the note form (simple: content field, required)
   - Fetch notes via useQuery(queryKeys.contacts.notes(contactId))

   Section 5 — Activity Timeline:
   - Vertical timeline with icons per activity type
   - Show last 10 activities
   - Each entry: icon, description text, relative timestamp
   - Fetch via useQuery(queryKeys.contacts.activities(contactId))

2. `src/components/crm/TagInput.tsx` — "use client":
   - Props: tags: Tag[], onAdd: (tagId: string) => void, onRemove: (tagId: string) => void, availableTags: Tag[], maxTags?: number (default 10)
   - Display: horizontal wrap of tag pills (colored based on tag.color)
   - Each pill: colored background, white/dark text, X remove button
   - Add: Shadcn Popover with Combobox (search available tags, filter out already added)
   - Visual: looks like a tagging system (think GitHub labels)

3. `src/components/crm/ContactActivityTimeline.tsx` — "use client":
   - Props: activities: Activity[]
   - Vertical timeline: left line + circle markers + content on right
   - Icon per type: MessageSquare for messages, Tag for tags, StickyNote for notes, UserCheck for assignment, RefreshCw for status change
   - Relative timestamps
   - "Show more" button if >10 activities
```

---

### Prompt 2.5 — 🔑 Inbox Page Assembly

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Assemble the complete Inbox page:

1. `src/app/(crm)/inbox/page.tsx`:
   - Three-panel layout: ConversationList (left 350px) | ChatWindow (center flex-1) | CustomerSidebar (right 320px, conditional)
   - Full height: h-[calc(100vh-56px)] (subtract TopBar height)
   - If no conversation selected (activeConversationId is null): show EmptyState in center panel ("Select a conversation" with MessageSquare icon)
   - Conversation selection updates URL via router.push(`/inbox?id=${conversationId}`) but doesn't use [conversationId] route
   - Read conversationId from searchParams on mount to restore selection
   - Set activeModule("inbox") in useUIStore on mount

2. `src/app/(crm)/inbox/loading.tsx`:
   - Three panel skeleton: left (8 conversation row skeletons), center (6 message bubble skeletons), right (profile skeleton)

3. `src/app/(crm)/inbox/error.tsx` — "use client":
   - "Failed to load inbox" with retry button

4. `src/app/(crm)/inbox/[conversationId]/page.tsx`:
   - Deep-link support: reads conversationId from params
   - Sets activeConversation in store
   - Renders same inbox layout with that conversation pre-selected

The inbox should feel like WhatsApp Web:
- Instant conversation switching (cached by TanStack Query)
- Smooth message appearance
- Chat area has WhatsApp-like background tint
- Responsive: sidebar collapses below 1280px, customer panel toggleable at any width
```

---

### Prompt 2.6 — Contacts Data Table Page

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Contacts module:

1. `src/components/contacts/ContactsTable.tsx` — "use client":
   - Full DataTable implementation using TanStack Table + Shadcn Table
   - Columns:
     • Checkbox (selection column)
     • Name + Avatar (avatar with initials fallback + name + phone on second line)
     • Email
     • Status (StatusBadge)
     • Tags (colored pills, max 3 shown + "+N more")
     • Assigned Agent (avatar + name)
     • Last Message (relative time)
     • Actions (dropdown: View, Edit, Delete with ConfirmDialog)
   - Features:
     • Column sorting (click headers)
     • Search by name/phone/email
     • Filter by status (All, Active, Inactive, Blocked) using Tabs
     • Filter by tags (multi-select)
     • Pagination: 25 rows/page, page controls, "Showing X-Y of Z"
     • Bulk actions bar (appears when rows selected): Delete selected, Add tag, Remove tag
   - Row click → navigate to /contacts/[contactId]
   - All filtering/sorting/pagination uses URL searchParams (so it's bookmarkable)
   - Data fetched via useQuery with queryKeys.contacts.list(filters)

2. `src/app/(crm)/contacts/page.tsx`:
   - PageHeader: "Contacts" title, "Manage your WhatsApp contacts" description
   - Actions: "Add Contact" button (opens Sheet drawer) + "Import" button (placeholder)
   - ContactsTable below
   - Filters persist in URL searchParams

3. `src/app/(crm)/contacts/loading.tsx` — table skeleton
4. `src/app/(crm)/contacts/error.tsx` — retry + "clear filters" suggestion
```

---

### Prompt 2.7 — Contact Add/Edit Form (Sheet Drawer)

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the contact add/edit form:

1. `src/components/contacts/ContactFormSheet.tsx` — "use client":
   - Props: open: boolean, onOpenChange, contact?: Contact (if editing), onSuccess?: () => void
   - Shadcn Sheet (slides from right, width 480px)
   - Title: "Add Contact" or "Edit Contact" based on whether contact prop exists
   - Form using React Hook Form + zodResolver(contactSchema):
     Fields:
     • Name — Input (required)
     • Phone — Input with +91 prefix hint (required, E.164 validation)
     • Email — Input (optional)
     • Tags — TagInput component (select from available tags)
     • Opt-in Status — Switch component
     • Custom Attributes — Dynamic key-value pairs: "Add attribute" button adds a row with key input + value input + remove button. Use useFieldArray pattern.
   - Validation: inline field errors (red text below inputs), form-level error summary at top if >2 errors
   - Submit:
     • Create: call createContact mutation, on success: close sheet, invalidate contacts list, show success toast
     • Edit: call updateContact mutation, same success handling
   - Cancel button + X close button
   - Loading state: submit button shows spinner, inputs disabled during submission
   - Pre-fill form when editing (useEffect to reset form with contact data)

2. `src/lib/hooks/useCreateContact.ts`:
   - useMutation wrapping createContact
   - onSuccess: invalidate queryKeys.contacts.lists()
   - onError: toast notification

3. `src/lib/hooks/useUpdateContact.ts`:
   - useMutation wrapping updateContact
   - onSuccess: invalidate queryKeys.contacts.detail(id) + queryKeys.contacts.lists()
   - onError: toast notification
```

---

### Prompt 2.8 — Contact Profile Detail Page

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the contact profile detail page:

1. `src/app/(crm)/contacts/[contactId]/page.tsx`:
   - Fetch contact data via useQuery(queryKeys.contacts.detail(contactId))
   - Layout:

   Top section (full width card):
   - Large avatar (80px) with initials fallback
   - Name (h1), phone, email, status badge
   - "Edit" button (opens ContactFormSheet), "Delete" button (ConfirmDialog)
   - Assigned agent display with reassign dropdown

   Two-column layout below:

   Left column (60%):
   - Contact Details card: phone, email, opt-in status, custom attributes (key: value list), created/updated dates
   - Conversations card: list of conversations with this contact (link to /inbox?id=X), each showing status + last message preview + date

   Right column (40%):
   - Tags section: TagInput with add/remove
   - Notes section: list of notes with add form (same as CustomerSidebar notes section)
   - Activity Timeline: ContactActivityTimeline component

2. `src/app/(crm)/contacts/[contactId]/loading.tsx`:
   - Profile skeleton matching the layout above

Make the profile page feel comprehensive — like a CRM contact record in HubSpot or Salesforce. Clean cards, proper spacing, all data at a glance.
```

---

### Prompt 2.9 — Inbox Loading + Empty States

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Implement all edge states for the Inbox and Contacts modules:

INBOX EMPTY STATES:
1. No conversations at all → EmptyState with MessageSquare icon, "No conversations yet", "Conversations will appear here when customers message you"
2. No conversations matching filters → EmptyState with Search icon, "No matches", "Try adjusting your filters" + "Clear Filters" button
3. No conversation selected (center panel) → EmptyState with MessageSquare icon, "Select a conversation", "Choose a conversation from the list to start chatting"
4. Conversation with no messages → EmptyState with MessageSquare icon, "No messages yet", "Send the first message to start the conversation" (inside ChatWindow)
5. No notes on contact → EmptyState with StickyNote icon, "No notes", "Add notes about this contact"
6. No activities on contact → EmptyState with Activity icon, "No activity yet", "Activity will be logged here automatically"

CONTACTS EMPTY STATES:
1. No contacts at all → EmptyState with Users icon, "Add your first contact", "Import contacts or add them manually", "Add Contact" action
2. No contacts matching search/filter → EmptyState with Search icon, "No contacts found", "Try a different search or filter", "Clear" action

LOADING STATES (verify these exist from earlier prompts):
- Inbox conversation list: 8 skeleton rows (circle + 2 lines each)
- Chat messages: 6 alternating left/right skeleton bubbles
- Contact table: skeleton table with header + 10 rows
- Contact profile: avatar skeleton + text lines + tag pills

Ensure all empty states use the EmptyState component built earlier. Apply Framer Motion fadeIn transition when content loads (empty state → content).
```

---

## Day 3: Templates + Campaigns + Segments

### Prompt 3.1 — Template List Page

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Template Management list page:

1. `src/components/templates/TemplateCard.tsx` — "use client":
   - Props: template: Template, onClick: () => void
   - Card layout: template displayName, category badge, language badge, status badge (StatusBadge component)
   - Body preview: first 100 chars of body.text with "..." truncation
   - Footer: usage count + last used relative time
   - Quality score indicator (green/yellow/red dot)
   - Hover: subtle elevation/shadow increase

2. `src/components/templates/TemplateListView.tsx` — "use client":
   - Toggle between grid view (TemplateCards) and list view (DataTable)
   - Grid: 3 columns on xl, 2 on md, 1 on sm
   - List: DataTable with columns: Name, Category, Language, Status, Quality, Usage Count, Last Used, Actions
   - Filters: status tabs (All, Approved, Pending, Rejected, Draft), category filter (dropdown), search
   - Fetch via useQuery(queryKeys.templates.list(filters))
   - View toggle buttons (Grid/List icons)

3. `src/app/(crm)/templates/page.tsx`:
   - PageHeader: "Templates", "Manage your WhatsApp message templates"
   - Actions: "Create Template" button → navigates to /templates/new
   - TemplateListView below
   - Loading state: grid of skeleton cards
   - Empty state: "Create your first template", "Templates let you send pre-approved messages"

4. `src/app/(crm)/templates/loading.tsx` — grid of 6 skeleton cards
5. `src/app/(crm)/templates/error.tsx` — retry
```

---

### Prompt 3.2 — 🔑 Template Builder Form

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Template Builder — the most complex form in the app:

1. `src/app/(crm)/templates/new/page.tsx` + `src/components/templates/TemplateBuilder.tsx`:
   - Two-column layout: Form (left 60%) | Live Preview (right 40%, sticky)
   - React Hook Form with zodResolver(templateSchema)
   
   Form sections (vertically stacked):

   Section 1 — Basic Info:
   - Template name (snake_case input with live formatting)
   - Display name (human-readable)
   - Category (Select: Marketing, Utility, Authentication)
   - Language (Select: English (en_US), Hindi (hi), + 5 more common options)

   Section 2 — Header (collapsible, optional):
   - Header type toggle (None, Text, Image, Video, Document)
   - If Text: text input (max 60 chars, character counter)
   - If Image/Video/Document: file upload placeholder (URL input for mock)
   - Variable support in text header: detect {{1}} pattern

   Section 3 — Body (required):
   - Large textarea (max 1024 chars, character counter showing "X/1024")
   - Variable insertion help: buttons to insert {{1}}, {{2}}, etc.
   - Auto-detect variables in text using regex /\{\{(\d+)\}\}/g
   - For each detected variable: show an "Example value" input below the textarea
   - Bold/italic formatting hints (WhatsApp supports *bold* and _italic_)

   Section 4 — Footer (collapsible, optional):
   - Text input (max 60 chars, character counter)
   - Typically used for "Not interested? Reply STOP"

   Section 5 — Buttons (collapsible, optional):
   - useFieldArray for buttons (max 3)
   - "Add Button" button (disabled at 3)
   - Each button row: type select (Quick Reply, URL, Phone, Copy Code), text input (max 25 chars)
   - Conditional fields: URL input for URL type, phone input for Phone type
   - Remove button (X) on each row
   - Drag handle for reordering (optional — skip if time-constrained)

   Submit: "Save as Draft" (status=draft) or "Submit for Review" (status=pending)
   - On submit: createTemplate mutation, navigate to /templates on success, success toast

2. `src/app/(crm)/templates/[templateId]/page.tsx`:
   - Same TemplateBuilder but pre-filled with existing template data (edit mode)
   - Fetch template via useQuery(queryKeys.templates.detail(templateId))
   - Title changes to "Edit Template"
   - Submit calls updateTemplate mutation

Form validation must show inline errors on blur and on submit. Use Shadcn FormField, FormItem, FormLabel, FormControl, FormMessage pattern consistently.
```

---

### Prompt 3.3 — Template Preview Component

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the live WhatsApp template preview:

1. `src/components/crm/TemplatePreview.tsx` — "use client":
   - Props: header?, body: { text, variables?, examples? }, footer?, buttons?, className?
   - Renders a WhatsApp-style message card that updates live as the form is edited
   - Visual design (make it look exactly like a WhatsApp template message):
     
     Container: rounded card with subtle shadow, WhatsApp chat bubble style background
     
     Header (if present):
     - Text type: bold text at top
     - Image type: gray image placeholder rectangle (or actual image if URL provided)
     
     Body:
     - Template text with variables highlighted in yellow/amber background (e.g., "Hello {{1}}" → "Hello" + yellow-highlighted "John")
     - Replace {{N}} with example values if provided, otherwise show "{{N}}" in highlight
     - Preserve line breaks
     
     Footer:
     - Gray italic text below body, smaller font size
     
     Buttons:
     - Each button as a full-width row at bottom
     - Blue text, separated by thin borders
     - Icon based on type: Reply icon for quick_reply, ExternalLink for URL, Phone for phone
     
     Bottom: "WhatsApp" watermark text in gray (like real template preview)
   
   - Dark mode support: adjust bubble colors and text contrast
   - The preview should feel like looking at an actual WhatsApp message

2. Use this component in the TemplateBuilder (right column) — it should use `watch()` from React Hook Form to reactively update as the user types. Debounce the preview update if needed for performance.

3. Also use this component in TemplateCard (templates list) as a mini-preview on hover (optional — tooltip with preview).
```

---

### Prompt 3.4 — Campaign List + Campaign Detail Page

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Campaign pages:

1. `src/app/(crm)/campaigns/page.tsx` — Campaign List:
   - PageHeader: "Campaigns", "Create and manage broadcast campaigns"
   - Actions: "Create Campaign" button → navigates to /campaigns/new
   - DataTable with columns:
     • Campaign name
     • Template name (linked)
     • Status (StatusBadge)
     • Audience count
     • Sent / Delivered / Read (as compact stats)
     • Scheduled/Sent date (relative time)
     • Actions dropdown: View, Duplicate, Cancel (if scheduled), Delete (if draft)
   - Filter tabs: All, Sent, Scheduled, Draft, Failed
   - Fetch via useQuery(queryKeys.campaigns.list(filters))
   - Empty state: "No campaigns yet", "Send your first bulk message"

2. `src/app/(crm)/campaigns/[campaignId]/page.tsx` — Campaign Detail:
   - Fetch campaign via useQuery(queryKeys.campaigns.detail(campaignId))
   - Header card: campaign name, status badge, template used, audience count, scheduled/sent date
   - Stats grid (4 cards): Total Sent, Delivered (%), Read (%), Failed (%)
   - Delivery Funnel chart (Recharts): Sent → Delivered → Read → Replied → Failed (horizontal bar)
   - Campaign timeline: Created → Scheduled → Sending → Completed (or Failed) — vertical timeline
   - Recipient preview: DataTable showing first 20 contacts in the segment (name, phone, delivery status)

3. `src/app/(crm)/campaigns/loading.tsx` — table skeleton
4. `src/app/(crm)/campaigns/error.tsx` — retry
5. `src/app/(crm)/campaigns/[campaignId]/loading.tsx` — detail page skeleton
```

---

### Prompt 3.5 — 🔑 Campaign Creation Wizard

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Campaign Creation Wizard:

1. `src/app/(crm)/campaigns/new/page.tsx`:
   - Full-width layout with Stepper at top
   - 4 steps, managed by useCampaignWizardStore

2. `src/components/campaigns/CampaignWizard.tsx` — "use client":
   - Stepper component showing 4 steps: Name → Audience → Template → Review
   - AnimatePresence with Framer Motion wizardStep transitions between steps
   - "Back" and "Next" buttons at bottom. "Next" triggers step validation via trigger()
   - "Cancel" button navigates back to /campaigns
   - Final step has "Send Now" and "Schedule" buttons

   Step 1 — Campaign Name (campaignStep1Schema):
   - Campaign name input (large, prominent)
   - Description textarea (optional, not in schema — just visual)

   Step 2 — Select Audience (campaignStep2Schema):
   - List of existing segments as selectable cards (radio-style selection)
   - Each card: segment name, description, estimated count badge
   - "Create New Segment" button → opens AudienceFilterBuilder inline
   - Selected segment shows estimated audience count prominently
   - Fetch segments via useQuery(queryKeys.segments.list())

   Step 3 — Select Template (campaignStep3Schema):
   - Grid of approved templates as selectable cards
   - Each card shows TemplatePreview mini version
   - Only approved templates are selectable (pending/rejected are grayed out with tooltip)
   - After selection: if template has variables, show variable mapping inputs
   - Live preview of selected template with filled variables on the right
   - Fetch templates via useQuery(queryKeys.templates.list({ status: "approved" }))

   Step 4 — Review & Schedule (campaignStep4Schema):
   - Summary card: campaign name, audience name + count, template preview
   - Schedule options: Radio group — "Send Now" or "Schedule for Later"
   - If "Schedule": DateTimePicker (Shadcn Calendar + time input)
   - "Send Campaign" / "Schedule Campaign" button
   - On submit: createCampaign mutation → navigate to /campaigns/[newId] → success toast

3. Each step validates independently using its Zod schema before allowing "Next"
4. Wizard data persists in useCampaignWizardStore across steps
5. resetWizard() called on mount and on successful submission
```

---

### Prompt 3.6 — Audience Filter Builder

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Audience Filter Builder:

1. `src/components/campaigns/AudienceFilterBuilder.tsx` — "use client":
   - Props: onChange: (filters: SegmentFilter[]) => void, initialFilters?: SegmentFilter[]
   - Dynamic filter rows using useFieldArray pattern (or manual state):
   
   Each filter row:
   - Field selector (Select): options = "Status", "Tag", "Last Message", "Created Date", "Custom Attribute (Plan)", "Custom Attribute (Company)"
   - Operator selector (Select): options change based on field type:
     • String fields: is, is_not, contains, not_contains
     • Date fields: gt (after), lt (before), between
     • Array fields (tags): in, not_in
   - Value input: changes based on field type:
     • Status → Select (active, inactive, blocked)
     • Tag → Multi-select combobox from available tags
     • Date → Date picker
     • Text → Text input
   - Remove row button (Trash icon)
   
   - Conjunction toggle between rows: AND / OR (Shadcn Toggle)
   - "Add Filter" button at bottom (Plus icon)
   - Live audience count estimate: display a badge "~X contacts match" that updates as filters change
     • Uses useQuery(queryKeys.segments.estimate(filters)) with debounce (500ms)
     • Shows loading spinner while estimating

   Design: Each filter row in a subtle card/border with consistent spacing. The whole component should feel like building a query visually.

2. `src/components/campaigns/SegmentCard.tsx`:
   - Props: segment: Segment, isSelected, onClick
   - Card showing: name, description, filter count badge, estimated count
   - Selected state: primary border + check icon
   - Hover: subtle shadow increase
```

---

### Prompt 3.7 — Team / Agent Management Page

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build the Team Management page:

1. `src/app/(crm)/team/page.tsx`:
   - PageHeader: "Team", "Manage agents and assignments"
   - Actions: "Add Agent" button (opens Dialog)
   - Agent list as cards grid (3 cols on xl, 2 on md, 1 on sm)
   
   Each agent card:
   - Avatar (large, 56px) with status dot overlay (green/yellow/gray for online/away/offline)
   - Name, email
   - Role badge (Admin=purple, Manager=blue, Agent=gray)
   - Stats: active conversations count / max conversations
   - Departments as small pills
   - Last active: relative time
   - Actions dropdown: Edit, Change Role, Remove (ConfirmDialog)

2. `src/components/team/AgentCard.tsx` — the card component described above

3. `src/components/team/AddAgentDialog.tsx`:
   - Shadcn Dialog
   - Form: name (required), email (required, valid email), role (select: admin, manager, agent), departments (multi-select), max conversations (number input, default 20)
   - Zod validation
   - Submit: mock create (add to mock agents array), invalidate agents query, close dialog, success toast

4. `src/app/(crm)/team/loading.tsx` — grid of 6 skeleton cards
5. `src/app/(crm)/team/error.tsx` — retry

Fetch agents via useQuery(queryKeys.agents.list()). Simple client-side filtering since dataset is small (<50 agents).
```

---

## Day 4: Polish + E2E + Docs + Deploy

### Prompt 4.1 — Automation Page (React Flow)

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build a basic Automation page with React Flow:

IMPORTANT: Install React Flow first: `pnpm add @xyflow/react`

1. `src/app/(crm)/automation/page.tsx`:
   - PageHeader: "Automation", "Build workflow automations for your messages"
   - Actions: "Create Workflow" button (placeholder), workflow list below
   - List 3 mock workflows: "Welcome Message", "Follow-up Reminder", "Abandoned Cart"
   - Each as a card with: name, status badge (active/draft), trigger description, created date
   - Click → navigate to /automation/[workflowId]

2. `src/app/(crm)/automation/[workflowId]/page.tsx`:
   - DYNAMICALLY IMPORT React Flow using next/dynamic with { ssr: false } — critical for bundle size
   - Full-screen canvas (h-[calc(100vh-56px)])
   - Pre-loaded demo workflow with 5 nodes:
     • Trigger node: "New Message Received" (green)
     • Condition node: "Contains keyword 'pricing'" (yellow)
     • Action node (yes branch): "Send Template: pricing_info" (blue)
     • Action node (no branch): "Assign to Agent" (blue)
     • End node: "End" (gray)
   - Connected with edges showing the flow

3. Custom Node Components (styled with Shadcn + Tailwind):
   - `src/components/automation/TriggerNode.tsx` — green accent, lightning bolt icon
   - `src/components/automation/ConditionNode.tsx` — yellow accent, GitBranch icon, Yes/No handles
   - `src/components/automation/ActionNode.tsx` — blue accent, Zap icon

4. React Flow features to enable: zoom, pan, minimap, controls panel
5. READ-ONLY for now (no drag-to-create or editing). Just a visual demo.
6. `src/app/(crm)/automation/loading.tsx` — large skeleton rectangle
7. `src/app/(crm)/automation/error.tsx` — retry with "React Flow error" messaging

This is a visual showcase for the demo — it should look impressive even though it's read-only.
```

---

### Prompt 4.2 — Settings Page (Placeholder)

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build a placeholder Settings page:

1. `src/app/(crm)/settings/page.tsx`:
   - PageHeader: "Settings", "Configure your WhatsApp CRM"
   - Tabs (Shadcn Tabs): General, Notifications, API Configuration, Team Settings
   
   General tab:
   - Business name input (pre-filled "MindClub Foundation")
   - WhatsApp Business Account ID (masked placeholder: "••••••1234")
   - Phone Number ID (masked placeholder)
   - Timezone select
   - "Save Changes" button (disabled — placeholder)

   Notifications tab:
   - Toggle switches: Email notifications, In-app notifications, New message alert, Campaign completion alert
   - All pre-set to enabled

   API Configuration tab:
   - API Mode display: "Mock" with yellow badge, "Switch to Real API" button (disabled)
   - Webhook URL display (placeholder)
   - "Connected" status indicator

   Team Settings tab:
   - Default max conversations per agent (number input)
   - Auto-assignment toggle
   - Business hours configuration (placeholder)

   Bottom: "Reset Demo Data" button (destructive variant) — calls resetDemoData() and invalidates all queries, shows success toast

This is a supporting page. Keep it functional-looking but don't over-invest. The "Reset Demo Data" button is the most important element for the demo.
```

---

### Prompt 4.3 — Complete Empty States Audit

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Audit and ensure ALL empty states are implemented across the entire app. Check each of these and implement any that are missing:

1. Inbox — No conversations → 💬 "No conversations yet" + "Conversations will appear here when customers message you"
2. Inbox (filtered) — No filter results → 🔍 "No matches" + "Try adjusting your filters" + [Clear Filters]
3. Inbox — No conversation selected → 💬 "Select a conversation" + "Choose a conversation from the list"
4. Chat — No messages → 💬 "No messages yet" + "Send the first message"
5. Contacts — No contacts → 👥 "Add your first contact" + [Add Contact]
6. Contacts (filtered) — No results → 🔍 "No contacts found" + [Clear]
7. Templates — No templates → 📝 "Create your first template" + [Create Template]
8. Campaigns — No campaigns → 📢 "No campaigns yet" + [Create Campaign]
9. Contact Activity — No activity → 📋 "No activity yet"
10. Contact Notes — No notes → 📌 "No notes" + [Add Note]
11. Automation — No workflows → ⚡ "Create your first workflow" + [Create Workflow] (placeholder)
12. Team — No agents → 👥 "Add your first agent" + [Add Agent]

Each empty state must:
- Use the EmptyState shared component
- Have appropriate Lucide icon
- Have title + description
- Have action button where applicable (that actually works)
- Animate in with fadeIn transition

Also verify that all loading.tsx files exist and render appropriate skeletons for each route.
```

---

### Prompt 4.4 — Error Boundaries Audit

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Audit and ensure every route has a proper error.tsx boundary:

1. `src/app/error.tsx` — Global error boundary: full-page centered, error icon, title, message, "Try Again" + "Go Home" buttons
2. `src/app/(crm)/dashboard/error.tsx` — "Dashboard Error" with retry
3. `src/app/(crm)/inbox/error.tsx` — "Connection Lost" style with auto-retry suggestion
4. `src/app/(crm)/contacts/error.tsx` — retry + "Clear filters" suggestion
5. `src/app/(crm)/contacts/[contactId]/error.tsx` — "Contact not found" + "Back to Contacts" link (handle 404-like scenarios)
6. `src/app/(crm)/templates/error.tsx` — retry
7. `src/app/(crm)/templates/new/error.tsx` — "Failed to load template builder" + retry
8. `src/app/(crm)/campaigns/error.tsx` — retry
9. `src/app/(crm)/campaigns/new/error.tsx` — "Failed to load campaign wizard" + retry
10. `src/app/(crm)/campaigns/[campaignId]/error.tsx` — retry
11. `src/app/(crm)/team/error.tsx` — retry
12. `src/app/(crm)/automation/error.tsx` — "Automation engine error" + retry (covers React Flow crashes)

Every error.tsx must:
- Be "use client"
- Accept { error, reset } props
- Log error to console using logger.error()
- Show error.message to user
- Have a "Try Again" button calling reset()
- Have consistent styling (use EmptyState or a similar centered layout)
- Include a TODO comment for Sentry integration

Create any missing error boundaries now.
```

---

### Prompt 4.5 — Dark Mode Audit

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Perform a comprehensive dark mode audit. Check and fix every component for proper dark mode support:

1. Sidebar: dark background should work in both modes (it's already dark-themed, ensure text contrast)
2. TopBar: proper background/border in dark mode
3. Chat bubbles: outbound=#005C4B, inbound=#1F2937 in dark mode
4. Message text: ensure white/light text on dark bubbles
5. Delivery ticks: ensure visibility on both bubble colors
6. All Shadcn components: verify they use CSS variables (they should by default)
7. Recharts: chart text color, grid lines, tooltip backgrounds must adapt
8. DataTable: header, rows, hover states, selection state
9. Cards: proper background and border in dark mode
10. Badges/Pills: tag colors need sufficient contrast in dark mode
11. Empty states: icon and text colors
12. Forms: input backgrounds, borders, placeholder text, error messages
13. Template preview: bubble colors and text contrast
14. Timeline components: line color, marker colors
15. React Flow: node backgrounds, edge colors, canvas background

For each issue found: fix using Tailwind dark: prefix or CSS variables.
Run the dev server, switch to dark mode, and visually verify every page. Fix any contrast issues.

The dark mode should feel premium — not just an afterthought. Think "Slack dark mode" or "Discord" level of polish.
```

---

### Prompt 4.6 — Keyboard Navigation + Accessibility

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Implement keyboard navigation and accessibility across the app:

1. SIDEBAR NAVIGATION:
   - Tab/Shift+Tab through nav items
   - Enter activates navigation
   - Active page has aria-current="page"
   - <nav aria-label="Main navigation">

2. CONVERSATION LIST:
   - ↑/↓ arrow keys to move selection between conversations
   - Enter to open selected conversation
   - Visible focus ring on focused item

3. CHAT:
   - Tab from conversation list → message composer
   - Enter to send (Shift+Enter for newline)
   - After sending, focus stays on composer

4. COMMAND SEARCH (⌘K):
   - Opens on Cmd+K / Ctrl+K globally
   - ↑/↓ to navigate results
   - Enter to select
   - Escape to close
   - Focus trapped inside when open

5. DATA TABLES:
   - Tab through sortable column headers
   - Enter/Space to toggle sort
   - Tab to pagination controls

6. DIALOGS/SHEETS:
   - Focus trapped inside when open
   - Escape closes
   - Focus returns to trigger element on close
   - First interactive element auto-focused on open

7. ARIA LABELS:
   - All icon-only buttons: aria-label
   - Badges with counts: aria-label describing the count
   - Avatar images: aria-label with person's name
   - Form inputs: aria-describedby for hint text
   - Navigation regions: aria-label
   - Main content: aria-label

8. REDUCED MOTION:
   - Verify the @media (prefers-reduced-motion: reduce) rule in globals.css
   - Framer Motion animations should check useReducedMotion hook
   - Provide instant transitions as fallback

Test by tabbing through the entire app flow: sidebar → dashboard → inbox → select conversation → send message → contacts → add contact → templates → campaigns.
```

---

### Prompt 4.7 — Unit + Integration Tests

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Set up testing infrastructure and write critical tests:

1. Install testing dependencies:
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react jsdom

2. Create `vitest.config.ts` at project root:
   - Configure jsdom environment
   - Setup files: ['./src/lib/test-utils/setup.ts']
   - Path aliases matching tsconfig

3. Create `src/lib/test-utils/setup.ts`:
   - Import '@testing-library/jest-dom'

4. Create `src/lib/test-utils/render.tsx`:
   - renderWithProviders function that wraps components in: QueryClientProvider (fresh client, retry: false), ThemeProvider, AuthProvider (mock admin)
   - Export this + re-export everything from @testing-library/react

5. Add test script to package.json: "test": "vitest", "test:run": "vitest run"

6. Write these UNIT tests:

   `src/lib/validators/__tests__/contact.test.ts`:
   - Valid contact passes validation
   - Missing name fails
   - Invalid phone format fails
   - Invalid email fails
   - Empty email string passes (optional field)

   `src/lib/validators/__tests__/template.test.ts`:
   - Valid template passes
   - Template name with uppercase fails
   - Body exceeding 1024 chars fails
   - More than 3 buttons fails
   - Button text exceeding 25 chars fails

   `src/lib/utils/__tests__/utils.test.ts`:
   - formatPhone formats correctly
   - formatRelativeTime returns appropriate strings
   - generateId returns prefixed IDs
   - cn merges classnames correctly

   `src/lib/api/__tests__/queryKeys.test.ts`:
   - Query keys produce correct arrays
   - Nested keys include parent segments

7. Write these COMPONENT tests:

   `src/components/crm/__tests__/StatusBadge.test.tsx`:
   - Renders correct text for each status
   - Applies correct color variant

   `src/components/crm/__tests__/MetricCard.test.tsx`:
   - Renders title and value
   - Shows skeleton when loading
   - Shows change indicator with correct direction

   `src/components/shared/__tests__/EmptyState.test.tsx`:
   - Renders title and description
   - Renders action button when provided
   - Calls onAction when button clicked

Run `pnpm test:run` and verify all tests pass.
```

---

### Prompt 4.8 — E2E Tests (Playwright)

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Set up Playwright E2E tests:

1. Install: pnpm add -D @playwright/test
2. Create `playwright.config.ts`:
   - baseURL: 'http://localhost:3000'
   - webServer: { command: 'pnpm dev', port: 3000, reuseExistingServer: true }
   - Projects: chromium only (for speed)
   - retries: 1

3. Add script to package.json: "test:e2e": "playwright test"

4. Create these E2E test files:

   `e2e/dashboard.spec.ts`:
   - Navigate to / → should redirect to /dashboard
   - Dashboard page loads KPI cards (verify 4 cards with numbers > 0)
   - Charts render (verify chart containers exist)
   - Sidebar navigation works (click each nav item, verify URL changes)
   - Dark mode toggle switches theme

   `e2e/inbox.spec.ts`:
   - Navigate to /inbox
   - Conversation list renders (verify at least 1 conversation row)
   - Click a conversation → chat window appears with messages
   - Type a message and send → message appears in chat
   - Customer sidebar shows contact info

   `e2e/contacts.spec.ts`:
   - Navigate to /contacts
   - Contacts table renders with data
   - Search filters the table
   - Click "Add Contact" → form sheet opens
   - Fill form and submit → new contact appears in table
   - Click contact row → profile page opens

   `e2e/templates.spec.ts`:
   - Navigate to /templates
   - Template list renders
   - Click "Create Template" → builder page opens
   - Fill template name, body text → preview updates live
   - Submit form → redirects to template list

   `e2e/campaigns.spec.ts`:
   - Navigate to /campaigns
   - Campaign list renders
   - Click "Create Campaign" → wizard opens
   - Complete Step 1 (name) → Step 2 (select segment) → Step 3 (select template) → Step 4 (review)
   - Submit → redirects to campaign detail

Each test should be self-contained and not depend on other tests. Use test.describe() for grouping.
Do NOT run the tests yet — just create the test files. We'll run them after the build verification.
```

---

### Prompt 4.9 — Documentation

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Create all project documentation:

1. `README.md` (overwrite the Next.js default):
   - Project title + description (WhatsApp CRM — Frontend Prototype)
   - Tech stack table (from stack_recommendation.md)
   - Prerequisites: Node 20+, pnpm 9+
   - Setup instructions: git clone, pnpm install, pnpm dev
   - Available scripts: dev, build, lint, test, test:e2e
   - Environment variables (.env.local)
   - Project structure overview (file tree with 1-line descriptions)
   - Architecture: state management strategy, mock→API swap pattern
   - Demo instructions: how to access, what to click
   - Contributing guidelines (brief)

2. `DELIVERABLES.md`:
   - List every completed screen with status ✅
   - Demo script (5-minute walkthrough):
     1. Dashboard: show KPIs, charts, tables
     2. Inbox: search → open conversation → send message → see ticks
     3. Contacts: search → add contact → view profile
     4. Templates: create template → see preview → save
     5. Campaigns: create campaign wizard → schedule
     6. Automation: view demo workflow
   - Known gaps and limitations
   - Post-MVP backlog items

3. `MOCK_VS_API.md`:
   - Table with columns: Feature | Mock Implementation | Real API Needed | Meta/WhatsApp API Endpoint
   - Cover every module: contacts, conversations, messages, templates, campaigns, segments, agents
   - Note which endpoints need webhooks (incoming messages, delivery status)
   - Auth requirements (WABA token, phone number ID)

4. `docs/ARCHITECTURE.md`:
   - Detailed layer diagram
   - State management decisions (Zustand vs TanStack Query vs RHF)
   - Component hierarchy diagram (text-based tree)
   - Data flow for key actions (send message, create template, launch campaign)

5. `docs/DEMO_SCRIPT.md`:
   - Minute-by-minute demo walkthrough for stakeholders
   - What to click, what to point out, what to emphasize
   - Anticipated questions and answers

All docs should be clear, concise, and professional. Use markdown tables, code blocks, and section headers.
```

---

### Prompt 4.10 — Final Build Verification

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Perform the final build verification checklist:

1. Run `pnpm lint` — fix any ESLint errors or warnings until clean
2. Run TypeScript check: `npx tsc --noEmit` — fix any type errors until clean
3. Run `pnpm test:run` — ensure all unit tests pass
4. Run `pnpm build` — ensure production build succeeds with no errors
5. Check the build output:
   - List the page sizes from .next output
   - Verify no single route exceeds 250KB gzipped
   - Note the total build size

6. If any of the above fail, fix the issues and re-run until all pass.

7. Start the production build locally: `pnpm start`
   - Navigate through every page
   - Verify no hydration errors in console
   - Verify no runtime errors

8. Create a summary of:
   - Total components created
   - Total pages/routes
   - Bundle size per route
   - Test count and results
   - Any known issues or warnings

After this verification passes, the project is ready for Vercel deployment.
```

---

## Bonus Prompts (If Time Permits)

### Prompt B.1 — DateRangePicker Component

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Build a proper DateRangePicker component:

`src/components/shared/DateRangePicker.tsx` — "use client":
- Props: value: { from: Date, to: Date } | undefined, onChange, presets?: boolean
- Uses Shadcn Popover + Calendar (date-range mode)
- Preset buttons: Today, Last 7 Days, Last 30 Days, Last 90 Days, Custom
- Display: "Sep 1 - Sep 28, 2026" in the trigger button
- Supports both light and dark mode
- Used in: Dashboard page (filter metrics), Campaign list (filter by date)

Wire it into the Dashboard page to filter the messageVolume chart by date range (mock filtering — just slice the array).
```

---

### Prompt B.2 — Responsive Polish

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

Polish responsive behavior at key breakpoints:

1. 1440px+ (large desktop): Full layout — sidebar expanded, customer sidebar visible, charts at full width
2. 1280px (desktop): Sidebar auto-collapses to icon-only mode
3. 1024px (small desktop/tablet landscape): 
   - Inbox: customer sidebar becomes a Sheet (overlay) instead of inline
   - Dashboard: charts stack vertically instead of 2-column
   - Contact table: hide less important columns (email, assigned agent)
4. Below 1024px: Show a "Desktop recommended" banner — this is a CRM, mobile is out of scope

Check each page at each breakpoint and fix any overflow, truncation, or layout issues. The app should look polished at 1024px-1920px range.
```

---

### Prompt B.3 — Performance: Bundle Analysis

```
You are a Senior Frontend Engineer working on the WhatsApp CRM at `d:\MINDCLUB FOUNDATION\CODE\WHATSAPP CRM FORNTEND`.

1. Install: pnpm add -D @next/bundle-analyzer
2. Update next.config.ts/next.config.js to use withBundleAnalyzer when ANALYZE=true
3. Run: ANALYZE=true pnpm build
4. Check the generated report:
   - Identify any unexpectedly large modules
   - Verify React Flow is only in the automation route
   - Verify Recharts is only in dashboard and campaign detail routes
   - Verify Framer Motion is tree-shaken properly
5. If any route exceeds 250KB gzipped, apply dynamic imports to reduce it
6. Report findings: per-route sizes, largest dependencies, optimization recommendations
```

---

> [!IMPORTANT]
> **Execution order is critical.** Prompts 0.1 → 0.2 → 1.1 → 1.2 → 1.3 are the foundation that everything else depends on. If any of these fail, debug before proceeding. Each Day boundary (1.11, 2.9, 3.7, 4.10) includes a verification step — don't skip these.

> [!TIP]
> **Between days**, run `pnpm dev` and manually verify the demo checkpoint described at the end of each day in the blueprint. This catches integration issues early before they compound.
