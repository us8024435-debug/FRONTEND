import { create } from "zustand";
import { ConversationStatus } from "@/lib/types";

export interface InboxFilters {
  status: ConversationStatus | "all";
  search: string;
  assignedTo: string | "all";
}

export interface ConversationState {
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  customerSidebarOpen: boolean;
  toggleCustomerSidebar: () => void;
  inboxFilters: InboxFilters;
  setInboxFilters: (filters: Partial<InboxFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: InboxFilters = {
  status: "all",
  search: "",
  assignedTo: "all",
};

export const useConversationStore = create<ConversationState>((set) => ({
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  customerSidebarOpen: true,
  toggleCustomerSidebar: () =>
    set((state) => ({ customerSidebarOpen: !state.customerSidebarOpen })),
  inboxFilters: defaultFilters,
  setInboxFilters: (filters) =>
    set((state) => ({
      inboxFilters: { ...state.inboxFilters, ...filters },
    })),
  resetFilters: () => set({ inboxFilters: defaultFilters }),
}));
