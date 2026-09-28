# System Architecture

## Overview
This application follows a modern React/Next.js layered architecture tailored for high performance and maintainability.

## Layer Diagram
1. **Routing Layer**: Next.js App Router (`src/app`). Handles URL routing, layout nesting, and error boundaries.
2. **Data Layer**: TanStack Query (`src/lib/api`). Manages async state, caching, refetching, and pagination.
3. **Component Layer**: Reusable UI blocks (`src/components/ui`) and feature-specific blocks (`src/components/crm`, `src/components/inbox`).
4. **State Management**: React Context/Zustand for global UI state (sidebar, theme), TanStack Query for server state.
5. **Validation Layer**: Zod schemas (`src/lib/validators`) ensuring data integrity at the boundaries.

## Data Flows
- **Reads**: Component calls `useQuery` -> Query function hits API client -> API returns data -> Component renders.
- **Writes**: Component calls `useMutation` -> Mutation hits API client -> On success, invalidates relevant query keys -> UI updates optimistically or on refetch.
- **Real-time (Future)**: WebSocket connection -> Zustand store or direct Query cache updates -> UI reflects instant changes.
