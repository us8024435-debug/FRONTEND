import { describe, it, expect } from "vitest";
import {
  campaignStep1Schema,
  campaignStep2Schema,
  campaignStep3Schema,
  campaignStep4Schema,
  campaignSchema,
} from "../campaign";

describe("campaignSchema & wizard steps", () => {
  it("validates Step 1 campaign name", () => {
    expect(campaignStep1Schema.safeParse({ name: "Diwali Special Offer" }).success).toBe(true);
    expect(campaignStep1Schema.safeParse({ name: "" }).success).toBe(false);
  });

  it("validates Step 2 segment selection", () => {
    expect(campaignStep2Schema.safeParse({ segmentId: "seg_vip_001" }).success).toBe(true);
    expect(campaignStep2Schema.safeParse({ segmentId: "" }).success).toBe(false);
  });

  it("validates Step 3 template and variable mapping", () => {
    const valid = {
      templateId: "tmpl_festive_sale",
      variables: { "1": "Customer", "2": "25% OFF" },
    };
    expect(campaignStep3Schema.safeParse(valid).success).toBe(true);
    expect(campaignStep3Schema.safeParse({ templateId: "" }).success).toBe(false);
  });

  it("validates Step 4 schedule requirement for later dispatch", () => {
    const validNow = { scheduleType: "now" as const };
    expect(campaignStep4Schema.safeParse(validNow).success).toBe(true);

    const invalidLater = { scheduleType: "later" as const, scheduledAt: "" };
    expect(campaignStep4Schema.safeParse(invalidLater).success).toBe(false);

    const validLater = {
      scheduleType: "later" as const,
      scheduledAt: "2026-10-01T10:00:00Z",
    };
    expect(campaignStep4Schema.safeParse(validLater).success).toBe(true);
  });

  it("validates complete campaign payload", () => {
    const fullCampaign = {
      name: "Q4 Product Launch",
      segmentId: "seg_active_users",
      templateId: "tmpl_new_launch",
      variables: { "1": "Valued User" },
      scheduleType: "now" as const,
    };
    const result = campaignSchema.safeParse(fullCampaign);
    expect(result.success).toBe(true);
  });
});
