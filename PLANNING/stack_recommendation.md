# WhatsApp CRM — Tech Stack Recommendation
**Senior Frontend Engineer Assessment | 28 September 2026**

---

## TL;DR — The Stack

| Layer | Choice | Why This, Not That |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | File routing, API routes for mocks, RSC, Vercel-native |
| **Language** | TypeScript (strict mode) | 8 modules × complex data shapes = type safety is non-negotiable |
| **Styling** | Tailwind CSS v4 | Utility-first, fast iteration, CSS-first config in v4 |
| **UI Components** | Shadcn UI (Radix primitives) | Copy-paste, fully customizable, production-quality out of box |
| **UI State** | Zustand | Lightweight, no boilerplate, perfect for sidebar/modal/filter state |
| **Server State** | TanStack Query v5 (React Query) | Mock fetchers now → swap to real API later with zero UI changes |
| **Forms** | React Hook Form + Zod | Template builder, campaign wizard, contact forms — all need validation |
| **Charts** | Recharts | React-native, lightweight, covers all dashboard metrics |
| **Data Tables** | TanStack Table v8 | Powers Shadcn DataTable — sorting, filtering, pagination built-in |
| **Automation Flow** | React Flow | Node-based Trigger→Condition→Action canvas |
| **Animations** | Framer Motion | Chat bubbles, drawers, wizard transitions — surgical use only |
| **Dates** | Day.js | Lightweight, moment-compatible, relative time for chat |
| **Icons** | Lucide React | Tree-shakeable, consistent, Shadcn-native |
| **Package Manager** | pnpm | Fastest install, strictest dependency resolution |
| **Deployment** | Vercel | Zero-config Next.js hosting, preview deploys per PR |

---

## Why Each Choice — Module by Module

### 1. Dashboard (Day 1)
**Needs:** Metric cards, bar/line/donut charts, overview tables, real-time feel

| Tool | Role |
|---|---|
| **Recharts** | Sent/Delivered/Read/Clicked/Replied/Failed charts — bar, line, donut |
| **Shadcn Card + Badge** | Metric cards with status indicators |
| **TanStack Query** | `useQuery` with mock fetchers → dashboard data loads asynchronously, exactly like production |
| **Framer Motion** | Counter animations on metric cards (number counting up) |

> [!NOTE]
> **Why Recharts over Tremor/Chart.js?** Recharts is pure React (no DOM manipulation), composes cleanly with Tailwind, and handles all 6 metric types without a wrapper library. Tremor is nice but adds another abstraction layer we don't need in 4 days.

---

### 2. WhatsApp Inbox / Live Chat (Day 2)
**Needs:** Conversation list, search, unread badges, chat thread, message bubbles, customer sidebar, tags, notes, assignment

This is the **hardest module** — it's essentially a messaging app inside a CRM.

| Tool | Role |
|---|---|
| **Zustand** | Active conversation, sidebar open/close, filter state, typing indicator |
| **TanStack Query** | Conversation list, message history (paginated), contact details |
| **Shadcn Sheet/Drawer** | Customer detail panel (slides in from right) |
| **Shadcn Command** | Quick-search conversations (⌘K style) |
| **Framer Motion** | Message bubble entrance animations, layout transitions when switching chats |
| **Day.js** | Relative timestamps ("2m ago", "Yesterday 3:42 PM") |
| **React Hook Form** | Quick-reply composer, note input |

> [!IMPORTANT]
> **Architecture decision:** Conversation state lives in TanStack Query cache (keyed by `conversationId`). Active conversation ID lives in Zustand. This means switching chats is instant if data is cached, and the mock→API swap only touches the fetcher function.

---

### 3. Contacts (Day 2)
**Needs:** Data table, search, filters, tags, custom attributes, add/edit drawer, activity timeline

| Tool | Role |
|---|---|
| **TanStack Table v8 + Shadcn DataTable** | Sortable, filterable, paginated contact list with column visibility |
| **Shadcn Sheet** | Add/edit contact drawer |
| **React Hook Form + Zod** | Contact form with validation (phone format, required fields, custom attributes) |
| **Zustand** | Active filters, selected contacts (for bulk actions) |

> [!TIP]
> Shadcn's DataTable pattern (built on TanStack Table) gives us sorting, filtering, pagination, row selection, and column visibility — all the CRM table patterns — with ~100 lines of setup code.

---

### 4. Template Management (Day 3)
**Needs:** Template builder (category, language, header/body/footer, variables, media, buttons), live preview, submission status tracking

| Tool | Role |
|---|---|
| **React Hook Form + Zod** | Complex nested form: header type, body with `{{variables}}`, footer, button arrays |
| **Zod** | Validate variable placeholders, button URL format, character limits per Meta spec |
| **Shadcn Tabs** | Category/language selection, preview tabs |
| **Custom Preview Component** | WhatsApp-style message preview (styled to look like actual WhatsApp) |
| **TanStack Query** | Template list with status badges (Pending/Approved/Rejected) |

> [!IMPORTANT]
> **Why React Hook Form here specifically?** Template forms have dynamic fields (add/remove buttons, variable insertion into body text, conditional header types). RHF's `useFieldArray` handles this cleanly. Formik would work but has more re-render overhead with this level of dynamism.

---

### 5. Campaigns (Day 3)
**Needs:** Multi-step wizard (audience → template → personalize → preview → send/schedule), campaign history, status tracking

| Tool | Role |
|---|---|
| **Zustand** | Wizard step state, selected audience, selected template |
| **React Hook Form + Zod** | Each wizard step validates independently |
| **Framer Motion** | Step transitions in the wizard (slide left/right) |
| **Shadcn Stepper pattern** | Visual progress indicator |
| **Recharts** | Campaign analytics (sent/delivered/read funnel) |
| **Day.js** | Schedule date/time picker, campaign timestamps |

---

### 6. Audience Segmentation (Day 3)
**Needs:** Filter builder (tags AND/OR attributes AND/OR campaign history), audience count preview

| Tool | Role |
|---|---|
| **Zustand** | Filter conditions array |
| **Shadcn Select + Combobox** | Field/operator/value selectors |
| **TanStack Query** | Live audience count as filters change (debounced mock query) |

---

### 7. Team / Agent Management (Day 2–3)
**Needs:** Agent list, role assignment, conversation routing, activity log

| Tool | Role |
|---|---|
| **TanStack Table** | Agent list with role badges, active conversation count |
| **Shadcn Dialog** | Add/edit agent, role assignment |
| **Shadcn Avatar** | Agent avatars throughout the app (inbox assignment, etc.) |

---

### 8. Automation Foundation (Day 3–4)
**Needs:** Visual workflow builder: Trigger → Condition → Action nodes

| Tool | Role |
|---|---|
| **React Flow** | Drag-and-drop node canvas with custom node types |
| **Shadcn Dialog** | Node configuration modals (select trigger type, set condition, choose action) |
| **Zustand** | Workflow state (nodes, edges, selected node) |

> [!NOTE]
> **Why React Flow?** Building a node-based workflow editor from scratch would take 2+ days alone. React Flow gives us the canvas, drag/drop, connections, zoom/pan, and custom nodes — we just style the nodes with Shadcn/Tailwind. This is what n8n, Zapier, and every automation tool uses under the hood.

---

## What I'm NOT Recommending (and Why)

| Rejected Option | Reason |
|---|---|
| **Vite + React Router** | No API routes (need them for mock endpoints), no SSR, more boilerplate for routing |
| **MUI / Ant Design** | Heavy, opinionated styling fights Tailwind, slower to customize for WhatsApp-style UI |
| **Redux / Redux Toolkit** | Overkill boilerplate for this scope. Zustand does the same with 1/10th the code |
| **Formik** | More re-renders than RHF, worse `useFieldArray` support for dynamic template forms |
| **Chart.js / D3** | Not React-native. Recharts gives us declarative charts that compose with our component system |
| **DnD Kit** | Good for list reordering, but React Flow is purpose-built for the node-based automation canvas |
| **Tailwind v3** | v4 is stable, CSS-first config is cleaner, and `@theme` directive simplifies our design tokens |
| **Prisma / Drizzle** | Backend concern — explicitly out of scope for the frontend-first phase |
| **NextAuth** | Auth is a supporting layer per the brief — mock auth context now, wire later |

---

## Mock → API Transition Architecture

This is the **key architectural decision** that makes the 4-day timeline work:

```
┌─────────────────────────────────────────────────┐
│                   UI Components                  │
│         (Shadcn + Tailwind + Framer Motion)      │
├─────────────────────────────────────────────────┤
│              TanStack Query Hooks                │
│     useContacts(), useMessages(), useTemplates() │
├─────────────────────────────────────────────────┤
│              Fetcher Functions                    │  ← SWAP POINT
│    lib/api/contacts.ts, lib/api/messages.ts      │
├──────────────┬──────────────────────────────────┤
│  NOW (Mock)  │        LATER (Real API)           │
│  return mock │  fetch('/api/contacts')           │
│  data with   │  → Meta WhatsApp Business API     │
│  async delay │  → Your backend                   │
└──────────────┴──────────────────────────────────┘
```

> [!IMPORTANT]
> **The entire UI never changes.** When you're ready to connect real APIs, you swap the fetcher function body — that's it. The components, hooks, state management, and UI all remain identical. This is why TanStack Query is the right choice here — it was designed for exactly this pattern.

---

## File Architecture Preview

```
src/
├── app/                          # Next.js App Router
│   ├── (crm)/                    # CRM layout group
│   │   ├── dashboard/
│   │   ├── inbox/
│   │   ├── contacts/
│   │   ├── templates/
│   │   ├── campaigns/
│   │   ├── team/
│   │   ├── automation/
│   │   └── layout.tsx            # Sidebar + topbar shell
│   ├── layout.tsx                # Root: providers, fonts, theme
│   └── page.tsx                  # Redirect to /dashboard
├── components/
│   ├── ui/                       # Shadcn components (auto-generated)
│   ├── dashboard/                # Dashboard-specific components
│   ├── inbox/                    # Chat components
│   ├── contacts/                 # Contact components
│   ├── templates/                # Template builder components
│   ├── campaigns/                # Campaign wizard components
│   ├── automation/               # React Flow nodes
│   └── shared/                   # Layout, navigation, common
├── lib/
│   ├── api/                      # Fetcher functions (mock → real)
│   ├── mock-data/                # Realistic mock data
│   ├── stores/                   # Zustand stores
│   ├── hooks/                    # Custom hooks
│   ├── validators/               # Zod schemas
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Helpers (cn, formatters, etc.)
├── styles/
│   └── globals.css               # Tailwind + theme tokens
```

---

## Package Count & Bundle Impact

| Category | Packages | Approx. Bundle Impact |
|---|---|---|
| Core | next, react, react-dom, typescript | Base (~90KB gzipped) |
| Styling | tailwindcss, class-variance-authority, clsx, tailwind-merge | Build-time only + ~2KB |
| UI | @radix-ui/* (via shadcn), lucide-react | Tree-shaken, ~15KB used |
| State | zustand, @tanstack/react-query | ~5KB + ~12KB |
| Forms | react-hook-form, zod, @hookform/resolvers | ~9KB + ~4KB |
| Charts | recharts | ~45KB (tree-shaken) |
| Tables | @tanstack/react-table | ~14KB |
| Automation | @xyflow/react (React Flow) | ~35KB |
| Animation | framer-motion | ~30KB (tree-shaken) |
| Dates | dayjs | ~2KB |
| **Total added** | | **~170KB gzipped** |

> [!TIP]
> This is well within acceptable limits for a CRM application. Code-splitting via Next.js App Router means users only load what's needed per page (e.g., React Flow only loads on `/automation`).

---

## Final Verdict

This stack is optimized for:

1. **Speed** — Shadcn + Tailwind + RHF means we're building features, not fighting frameworks
2. **Swappability** — TanStack Query's fetcher pattern means mock→API is a one-line change per endpoint
3. **Polish** — Framer Motion + Shadcn + Tailwind v4 delivers AiSensy-level visual quality
4. **Maintainability** — TypeScript strict + Zod + clear file architecture = any developer can pick this up
5. **4-day feasibility** — Every tool chosen reduces boilerplate and maximizes feature output per hour

**Ready to scaffold when you give the green light.** 🚀
