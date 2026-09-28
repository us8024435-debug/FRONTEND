import { describe, it, expect } from "vitest";
import { messageSchema } from "../message";

describe("messageSchema", () => {
  it("passes validation for a valid outbound text message", () => {
    const valid = {
      type: "text" as const,
      content: {
        text: "Hello, thank you for reaching out to MindClub support!",
      },
    };

    const result = messageSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("text");
      expect(result.data.content.text).toBe(valid.content.text);
    }
  });

  it("fails validation when text message content is empty", () => {
    const invalid = {
      type: "text" as const,
      content: {
        text: "   ",
      },
    };

    const result = messageSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("text"))).toBe(true);
    }
  });

  it("passes validation for image messages with mediaUrl and caption", () => {
    const valid = {
      type: "image" as const,
      content: {
        mediaUrl: "https://example.com/receipt.jpg",
        caption: "Here is your invoice",
      },
    };

    const result = messageSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
