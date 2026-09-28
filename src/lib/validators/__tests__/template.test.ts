import { describe, it, expect } from "vitest";
import { templateSchema, templateButtonSchema } from "../template";

describe("templateSchema", () => {
  it("passes validation for a valid WhatsApp message template", () => {
    const validData = {
      name: "shipping_update_v1",
      displayName: "Shipping Update v1",
      category: "utility" as const,
      language: "en",
      header: {
        type: "text" as const,
        text: "Order Shipped",
      },
      body: {
        text: "Hi {{1}}, your package has shipped! Track here: {{2}}",
        examples: ["Alex", "https://track.example.com/123"],
      },
      footer: {
        text: "MindClub Support",
      },
      buttons: [
        {
          type: "url" as const,
          text: "Track Package",
          url: "https://track.example.com",
        },
        {
          type: "quick_reply" as const,
          text: "Contact Support",
        },
      ],
    };

    const result = templateSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("shipping_update_v1");
      expect(result.data.buttons).toHaveLength(2);
    }
  });

  it("fails when template name contains uppercase letters or spaces", () => {
    const invalidNames = ["Shipping_Update", "shipping update", "order-123!", "TEST"];

    invalidNames.forEach((name) => {
      const result = templateSchema.safeParse({
        name,
        displayName: "Invalid Template",
        category: "marketing",
        body: { text: "Hello customer" },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("name"))).toBe(true);
      }
    });
  });

  it("fails when body text exceeds 1024 characters", () => {
    const longText = "a".repeat(1025);
    const result = templateSchema.safeParse({
      name: "long_template",
      displayName: "Long Template",
      category: "marketing",
      body: { text: longText },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("body"))).toBe(true);
    }
  });

  it("fails when more than 3 buttons are defined", () => {
    const result = templateSchema.safeParse({
      name: "too_many_buttons",
      displayName: "Buttons Test",
      category: "marketing",
      body: { text: "Check these options out" },
      buttons: [
        { type: "quick_reply", text: "Opt 1" },
        { type: "quick_reply", text: "Opt 2" },
        { type: "quick_reply", text: "Opt 3" },
        { type: "quick_reply", text: "Opt 4" },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("buttons"))).toBe(true);
    }
  });

  it("fails when button text exceeds 25 characters", () => {
    const result = templateButtonSchema.safeParse({
      type: "quick_reply",
      text: "This button label is way too long for Meta",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("text"))).toBe(true);
    }
  });
});
