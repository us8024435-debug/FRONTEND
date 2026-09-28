import { z } from "zod";

/**
 * Validation schema for WhatsApp interactive template action buttons
 */
export const templateButtonSchema = z.object({
  type: z.enum(["quick_reply", "url", "phone", "copy_code"], {
    message: "Button type is required",
  }),

  text: z
    .string({ message: "Button label is required" })
    .trim()
    .min(1, "Button label cannot be empty")
    .max(25, "Button label cannot exceed 25 characters"),

  url: z
    .string()
    .trim()
    .url("Button URL must be a valid web address (e.g. https://example.com)")
    .optional()
    .or(z.literal("")),

  phoneNumber: z.string().trim().optional().or(z.literal("")),
});

export type TemplateButtonInput = z.infer<typeof templateButtonSchema>;

/**
 * Validation schema for creating a WhatsApp Business message template
 */
export const templateSchema = z.object({
  name: z
    .string({ message: "Template name identifier is required" })
    .trim()
    .min(1, "Template name cannot be empty")
    .max(512, "Template name cannot exceed 512 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Template name must contain only lowercase alphanumeric characters and underscores (e.g. order_update_v1)",
    ),

  displayName: z
    .string({ message: "Display name is required" })
    .trim()
    .min(1, "Display name cannot be empty")
    .max(200, "Display name cannot exceed 200 characters"),

  category: z.enum(["marketing", "utility", "authentication"], {
    message: "Template category is required",
  }),

  language: z
    .string({ message: "Language code is required" })
    .trim()
    .min(2, "Language code must be at least 2 characters")
    .max(10, "Language code cannot exceed 10 characters")
    .default("en"),

  header: z
    .object({
      type: z.enum(["none", "text", "image", "video", "document"]).default("none"),
      text: z.string().trim().max(60, "Header text cannot exceed 60 characters").optional(),
      mediaUrl: z
        .string()
        .trim()
        .url("Header media must be a valid URL")
        .optional()
        .or(z.literal("")),
    })
    .optional(),

  body: z.object({
    text: z
      .string({ message: "Body message text is required" })
      .trim()
      .min(1, "Body message text cannot be empty")
      .max(1024, "Body message text cannot exceed 1024 characters"),
    examples: z.array(z.string()).optional(),
  }),

  footer: z
    .object({
      text: z.string().trim().max(60, "Footer text cannot exceed 60 characters").optional(),
    })
    .optional(),

  buttons: z
    .array(templateButtonSchema)
    .max(3, "A WhatsApp template can have at most 3 interactive buttons")
    .optional()
    .default([]),
});

export type CreateTemplateInput = z.infer<typeof templateSchema>;
