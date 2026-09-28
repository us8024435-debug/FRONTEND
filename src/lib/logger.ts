const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

/**
 * Structured logging utility for WhatsApp CRM.
 * Suppresses dev-only logs when NEXT_PUBLIC_APP_ENV === "production".
 */
export const logger = {
  /**
   * Logs info message with [INFO] prefix. Suppressed in production.
   */
  info(msg: string, data?: unknown): void {
    if (isProduction) return;
    if (data !== undefined) {
      console.info(`[INFO] ${msg}`, data);
    } else {
      console.info(`[INFO] ${msg}`);
    }
  },

  /**
   * Logs warning message with [WARN] prefix. Always active.
   */
  warn(msg: string, data?: unknown): void {
    if (data !== undefined) {
      console.warn(`[WARN] ${msg}`, data);
    } else {
      console.warn(`[WARN] ${msg}`);
    }
  },

  /**
   * Logs error message with [ERROR] prefix. Always active.
   * Includes forwarder hook for external crash reporting.
   */
  error(msg: string, error?: unknown): void {
    if (error !== undefined) {
      console.error(`[ERROR] ${msg}`, error);
    } else {
      console.error(`[ERROR] ${msg}`);
    }
    // TODO: Integrate Sentry error reporting (e.g., Sentry.captureException(error ?? new Error(msg)))
  },

  /**
   * Logs query status with [Query] prefix. Suppressed in production.
   */
  query(key: unknown, status: string): void {
    if (isProduction) return;
    console.debug(`[Query] [${status}]`, key);
  },
};
