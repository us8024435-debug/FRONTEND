import { create } from "zustand";

export interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  activeModule: "dashboard",
  setActiveModule: (module) => set({ activeModule: module }),
}));
