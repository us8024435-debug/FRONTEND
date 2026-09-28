import { z } from "zod";

/**
 * Step 1: Campaign Basic Info
 */
export const campaignStep1Schema = z.object({
  name: z
    .string({ message: "Campaign name is required" })
    .trim()
    .min(1, "Campaign name cannot be empty")
    .max(200, "Campaign name cannot exceed 200 characters"),
});

export type CampaignStep1Input = z.infer<typeof campaignStep1Schema>;

/**
 * Step 2: Target Audience Segment Selection
 */
export const campaignStep2Schema = z.object({
  segmentId: z
    .string({ message: "Audience segment selection is required" })
    .trim()
    .min(1, "Please select an audience segment"),
});

export type CampaignStep2Input = z.infer<typeof campaignStep2Schema>;

/**
 * Step 3: Message Template & Variables
 */
export const campaignStep3Schema = z.object({
  templateId: z
    .string({ message: "WhatsApp template selection is required" })
    .trim()
    .min(1, "Please select a message template"),

  variables: z.record(z.string(), z.string()).optional().default({}),
});

export type CampaignStep3Input = z.infer<typeof campaignStep3Schema>;

/**
 * Step 4: Dispatch Schedule
 */
export const campaignStep4Schema = z
  .object({
    scheduleType: z.enum(["now", "later"], {
      message: "Please choose when to send this campaign",
    }),

    scheduledAt: z.string().trim().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.scheduleType === "later") {
        return Boolean(data.scheduledAt && data.scheduledAt.trim().length > 0);
      }
      return true;
    },
    {
      message: "Please specify a future date and time for scheduled broadcasts",
      path: ["scheduledAt"],
    },
  );

export type CampaignStep4Input = z.infer<typeof campaignStep4Schema>;

/**
 * Combined Complete Campaign Creation Schema
 */
export const campaignSchema = z
  .object({
    name: campaignStep1Schema.shape.name,
    segmentId: campaignStep2Schema.shape.segmentId,
    templateId: campaignStep3Schema.shape.templateId,
    variables: campaignStep3Schema.shape.variables,
    scheduleType: z.enum(["now", "later"], {
      message: "Please choose when to send this campaign",
    }),
    scheduledAt: z.string().trim().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.scheduleType === "later") {
        return Boolean(data.scheduledAt && data.scheduledAt.trim().length > 0);
      }
      return true;
    },
    {
      message: "Please specify a future date and time for scheduled broadcasts",
      path: ["scheduledAt"],
    },
  );

export type CreateCampaignInput = z.infer<typeof campaignSchema>;
