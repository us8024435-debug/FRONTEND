import { z } from "zod";

/**
 * Validation schema for creating or updating a CRM contact
 */
export const contactSchema = z.object({
  name: z
    .string({ message: "Contact name is required" })
    .trim()
    .min(1, "Contact name cannot be empty")
    .max(100, "Contact name cannot exceed 100 characters"),

  phone: z
    .string({ message: "Phone number is required" })
    .trim()
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Phone number must be in valid E.164 international format (e.g. +919876543210)",
    ),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),

  tags: z.array(z.string()).default([]),

  customAttributes: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .default({}),

  optInStatus: z.boolean().default(true),
});

export type CreateContactInput = z.infer<typeof contactSchema>;
export type UpdateContactInput = Partial<CreateContactInput>;
