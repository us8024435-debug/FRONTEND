<p align="center">
  <img src="public/logo.png" alt="WhatsApp CRM Logo" width="100" height="100" style="border-radius: 50%;" />
</p>

<h1 align="center">WhatsApp CRM — Enterprise Business Messaging & Operations</h1>

<p align="center">
  A production-ready, ultra-responsive CRM frontend for enterprise WhatsApp Business API operations, automated marketing workflows, and real-time customer engagement.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Vitest-Unit_Tested-6E9F18?style=flat-square&logo=vitest" alt="Vitest Tested" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 🌟 Key Features

- **⚡ Real-Time Omnichannel Inbox**: WhatsApp-style conversational chat window, delivery receipt ticks (Sending 🕒 ➔ Sent ✓ ➔ Delivered ✓✓ ➔ Read ✓✓ Blue), rich media rendering, interactive template messages, and deep customer profile sidebar.
- **📊 Executive KPI Dashboard**: Real-time message volume graphs, agent resolution metrics, CSAT scores, and activity stream powered by Recharts.
- **👥 Contact Intelligence & Segmentation**: Filterable data tables with server/client pagination, custom tags, opt-in toggles, notes, and activity timeline audit log.
- **🎨 Interactive WhatsApp Template Builder**: Live WYSIWYG Meta message template builder with dynamic variable replacement (`{{1}}`, `{{2}}`), quick reply buttons, URL call-to-actions, and phone number links.
- **📢 Outbound Campaign Wizard**: 4-step broadcast campaign creator with audience filtering, template selection, dynamic variable mapping, scheduled delivery, and conversion funnel analytics.
- **🔀 Automation Workflow Canvas**: Visual node-based workflow builder powered by `@xyflow/react` for triggers, keyword routing, auto-assignment, and template dispatch.
- **🛡️ Team & Agent Operations**: Agent capacity planning, active chat workload monitoring, and role-based permissions (Admin, Manager, Agent).
- **🌗 Sleek Theming & Accessibility**: Native Dark Mode support via `next-themes`, fluid glassmorphism, responsive sidebar, WCAG 2.1 AA keyboard navigation, and global `⌘K` command palette.

---

## 🏗️ Technology Stack

| Domain | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | React Server Components, nested layouts, optimized route handlers, and fast Turbopack builds. |
| **UI Primitives** | Shadcn UI & Radix UI | Accessible, unstyled, composable UI building blocks with full keyboard and screen reader support. |
| **Styling** | Tailwind CSS v4 | Cutting-edge CSS variables engine, modern `@theme inline` design tokens, and instant HMR. |
| **Server State** | TanStack Query v5 | Robust async data fetching, aggressive caching, optimistic updates, and background refetching. |
| **Client & UI State** | Zustand & React Context | Lightweight global state for sidebar, active modal drawers, command palette, and auth session. |
| **Form Management** | React Hook Form + Zod | Type-safe form validation with zero unnecessary re-renders. |
| **Visual Workflow** | @xyflow/react (React Flow) | Dynamic node and edge graph canvas for multi-branch automation flows. |
| **Data Visualization**| Recharts | Responsive SVG charts for message volumes and campaign delivery funnels. |
| **Testing** | Vitest & Playwright | Rapid unit/component testing in jsdom and end-to-end browser automation. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `20.x` or higher
- **pnpm**: `9.x` or `10.x` recommended (`corepack enable pnpm`)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/whatsapp-crm-frontend.git
   cd whatsapp-crm-frontend
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

3. **Install dependencies**:
   ```bash
   pnpm install --frozen-lockfile
   ```

4. **Launch development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `pnpm dev` | `next dev` | Starts Next.js development server with Turbopack |
| `pnpm build` | `next build` | Produces production-optimized build output |
| `pnpm start` | `next start` | Runs production server locally |
| `pnpm lint` | `eslint` | Runs ESLint analysis across TypeScript & JSX files |
| `pnpm test` | `vitest` | Runs Vitest in interactive watch mode |
| `pnpm test:run` | `vitest run` | Runs unit & component tests once (CI mode) |
| `pnpm test:e2e` | `playwright test` | Runs Playwright end-to-end browser tests |

---

## 📂 Project Architecture & Directory Structure

```
├── .github/                   # GitHub Actions CI/CD workflows, PR and Issue templates
├── docs/                      # Architectural specifications & demo scripts
├── e2e/                       # Playwright end-to-end test scenarios
├── public/                    # Static assets, branding logo, favicons, illustrations
├── src/
│   ├── app/                   # Next.js 15 App Router structure
│   │   ├── (auth)/login/      # Agent authentication & session view
│   │   ├── (crm)/             # Authenticated workspace shell
│   │   │   ├── dashboard/     # KPI cards, metrics, and activity charts
│   │   │   ├── inbox/         # Multi-channel chat & contact sidebar
│   │   │   ├── contacts/      # Contact table, filter sheets, profile tabs
│   │   │   ├── templates/     # Meta message template library & live builder
│   │   │   ├── campaigns/     # Outbound broadcasts & 4-step wizard
│   │   │   ├── automation/    # Node-based automation canvas ([workflowId])
│   │   │   ├── team/          # Agent workload & performance monitoring
│   │   │   └── settings/      # Account config, WABA settings, demo reset
│   │   ├── error.tsx          # Global route error boundary
│   │   ├── layout.tsx         # Root layout with font, theme & query providers
│   │   ├── loading.tsx        # Global fallback suspense skeleton
│   │   └── not-found.tsx      # Custom 404 handler
│   ├── components/            # Reusable UI component library
│   │   ├── automation/        # React Flow custom node components
│   │   ├── campaigns/         # Wizard steps, funnel charts, recipient preview
│   │   ├── contacts/          # Data tables, drawers, profile tabs
│   │   ├── crm/               # Status badges, metric cards, timelines, tag inputs
│   │   ├── inbox/             # Chat bubbles, composer, delivery ticks, sidebar
│   │   ├── shared/            # TopBar, Sidebar, CommandSearch, EmptyState
│   │   └── ui/                # Base Shadcn/Radix components
│   └── lib/                   # Business logic, stores, API clients
│       ├── api/               # Query hooks, key factories, mock store
│       ├── auth/              # Mock agent authentication context
│       ├── hooks/             # Custom utility hooks (debounce, keyboard, media)
│       ├── mock-data/         # Curated realistic WhatsApp CRM fixtures
│       ├── stores/            # Zustand stores for UI state
│       ├── types/             # Single source of truth TypeScript interfaces
│       ├── utils.ts           # E.164 phone formatting, time diffs, class merging
│       └── validators/        # Zod validation schemas
├── DELIVERABLES.md            # Sprint deliverables, screen inventory & sign-off
├── MOCK_VS_API.md             # Meta Graph API v22+ transition & webhook specs
└── next.config.ts             # Security headers, image optimization, analyzer
```

---

## 🔌 Mock to Real Meta API Transition

This project features a clean **Gateway Adapter Pattern**. By default, it operates in simulated mock mode (`NEXT_PUBLIC_API_MODE=mock`) backed by an in-memory reactive store with local storage synchronization.

To transition to production WhatsApp Cloud API:
1. Set `NEXT_PUBLIC_API_MODE=real` in `.env.local`.
2. Connect your backend endpoints as detailed in [MOCK_VS_API.md](./MOCK_VS_API.md).
3. Configure webhook subscriptions for `messages` and `statuses` updates.

---

## 🤝 Contributing & Code Quality Guidelines

1. **Strict TypeScript**: No `any` types. All entities and function signatures must be strictly typed.
2. **Formatting**: Ensure files comply with `.prettierrc` (`pnpm prettier --check "src/**/*.{ts,tsx}"`).
3. **Linting**: Ensure code passes ESLint with zero warnings (`pnpm lint`).
4. **Testing**: Add unit tests for new validators or utilities, and verify existing tests pass (`pnpm test:run`).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
