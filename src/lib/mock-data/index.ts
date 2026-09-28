/**
 * WhatsApp CRM - Complete Mock Data Layer
 */

export * from "./tags";
export * from "./agents";
export * from "./contacts";
export * from "./conversations";
export * from "./messages";
export * from "./templates";
export * from "./campaigns";
export * from "./segments";
export * from "./activities";
export * from "./notes";
export * from "./dashboard";

// Re-export utility delay for mock API latency simulation
export { delay } from "@/lib/utils";

// Registry for in-memory mock store reset callbacks
let storeResetCallback: (() => void) | null = null;

export function registerStoreReset(cb: () => void): void {
  storeResetCallback = cb;
}

/**
 * Resets the in-memory demo data to initial factory state.
 * Useful for demo environments and test suites.
 */
export function resetDemoData(): void {
  if (storeResetCallback) {
    try {
      storeResetCallback();
    } catch (e) {
      console.error("Failed to reset in-memory store:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage?.removeItem("whatsapp_crm_mock_state");
      window.localStorage?.removeItem("whatsapp_crm_mock_state");
    } catch {
      // Ignore storage access errors in restricted contexts
    }
  }
}
