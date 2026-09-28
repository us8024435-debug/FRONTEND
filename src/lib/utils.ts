import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Combines conditional class names and merges Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats E.164 phone numbers to human-friendly display format
 * e.g., "+919876543210" -> "+91 98765 43210"
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.trim().replace(/[^\d+]/g, "");

  // Indian format: +91 98765 43210
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }

  // 10-digit without country code (standard Indian mobile)
  if (cleaned.length === 10 && !cleaned.startsWith("+")) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  // Generic international format
  const match = cleaned.match(/^(\+\d{1,3})(\d{3,5})(\d{4,})$/);
  if (match && match[1] && match[2] && match[3]) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  return phone;
}

/**
 * Formats timestamps to intuitive relative time display
 * e.g., "2m ago", "Yesterday 3:42 PM", "Sep 15"
 */
export function formatRelativeTime(date: string | Date): string {
  if (!date) return "";
  const d = dayjs(date);
  const now = dayjs();
  const diffSec = now.diff(d, "second");
  const diffMin = now.diff(d, "minute");
  const diffHours = now.diff(d, "hour");

  if (diffSec < 60) {
    return "just now";
  }

  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  if (diffHours < 24 && d.isSame(now, "day")) {
    return `${diffHours}h ago`;
  }

  const yesterday = now.subtract(1, "day");
  if (d.isSame(yesterday, "day")) {
    return `Yesterday ${d.format("h:mm A")}`;
  }

  if (d.isSame(now, "year")) {
    return d.format("MMM D");
  }

  return d.format("MMM D, YYYY");
}

/**
 * Simulates network latency for mock API calls
 */
export function delay(min: number = 300, max: number = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates prefixed random IDs, e.g., "contact_a1b2c3"
 */
export function generateId(prefix: string): string {
  const randomHex = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${randomHex}`;
}
