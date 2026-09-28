import { describe, it, expect } from "vitest";
import { contactSchema } from "../contact";

describe("contactSchema", () => {
  it("passes validation for a complete, valid contact payload", () => {
    const validData = {
      name: "Aarav Sharma",
      phone: "+919876543210",
      email: "aarav@example.com",
      tags: ["vip", "enterprise"],
      customAttributes: { tier: "gold", priority: 1, active: true },
      optInStatus: true,
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Aarav Sharma");
      expect(result.data.phone).toBe("+919876543210");
      expect(result.data.tags).toHaveLength(2);
    }
  });

  it("fails validation when contact name is empty or missing", () => {
    const invalidData = {
      name: "   ",
      phone: "+919876543210",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("name"))).toBe(true);
    }
  });

  it("fails validation when phone number is not valid E.164 format", () => {
    const invalidPhones = ["9876543210", "+1", "invalid_phone", "+91 98765 43210"];

    invalidPhones.forEach((phone) => {
      const result = contactSchema.safeParse({
        name: "Test User",
        phone,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("phone"))).toBe(true);
      }
    });
  });

  it("fails validation when email is malformed", () => {
    const result = contactSchema.safeParse({
      name: "Test User",
      phone: "+919876543210",
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("email"))).toBe(true);
    }
  });

  it("passes validation when email is empty string or undefined", () => {
    const withEmpty = contactSchema.safeParse({
      name: "Test User",
      phone: "+919876543210",
      email: "",
    });
    expect(withEmpty.success).toBe(true);

    const withoutEmail = contactSchema.safeParse({
      name: "Test User",
      phone: "+919876543210",
    });
    expect(withoutEmail.success).toBe(true);
  });

  it("applies default values for optional fields", () => {
    const minimal = {
      name: "Rohan Patel",
      phone: "+919123456780",
    };

    const result = contactSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
      expect(result.data.customAttributes).toEqual({});
      expect(result.data.optInStatus).toBe(true);
    }
  });
});
