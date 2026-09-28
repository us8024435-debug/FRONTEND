import { describe, it, expect } from "vitest";
import { cn, formatPhone, formatRelativeTime, generateId, delay } from "../../utils";
import dayjs from "dayjs";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names and resolves Tailwind CSS conflicts correctly", () => {
      expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-red-500", false && "hidden", null, undefined, "text-blue-500")).toBe(
        "text-blue-500",
      );
    });
  });

  describe("formatPhone", () => {
    it("formats 13-digit E.164 Indian phone numbers with space groupings", () => {
      expect(formatPhone("+919876543210")).toBe("+91 98765 43210");
    });

    it("formats 10-digit Indian mobile numbers by prefixing +91", () => {
      expect(formatPhone("9876543210")).toBe("+91 98765 43210");
    });

    it("handles generic international phone numbers", () => {
      const formatted = formatPhone("+14155552671");
      expect(formatted).toMatch(/^\+1/);
    });

    it("returns empty string if input is falsy", () => {
      expect(formatPhone("")).toBe("");
    });
  });

  describe("formatRelativeTime", () => {
    it("returns 'just now' for times within 60 seconds", () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe("just now");
    });

    it("returns relative minutes ago for recent times", () => {
      const fiveMinAgo = dayjs().subtract(5, "minute").toISOString();
      expect(formatRelativeTime(fiveMinAgo)).toBe("5m ago");
    });

    it("returns empty string for empty input", () => {
      expect(formatRelativeTime("")).toBe("");
    });
  });

  describe("generateId", () => {
    it("generates random IDs prefixed with provided category key", () => {
      const id1 = generateId("contact");
      const id2 = generateId("contact");

      expect(id1.startsWith("contact_")).toBe(true);
      expect(id2.startsWith("contact_")).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe("delay", () => {
    it("resolves asynchronously after given duration range", async () => {
      const start = Date.now();
      await delay(10, 30);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(8);
    });
  });
});
