import { z } from "zod";

/**
 * Filter rule within an audience segment
 */
export const segmentFilterSchema = z.object({
  field: z
    .string({ message: "Filter target field is required" })
    .trim()
    .min(1, "Filter target field cannot be empty"),

  operator: z.enum(
    ["is", "is_not", "contains", "not_contains", "gt", "lt", "between", "in", "not_in"],
    {
      message: "Comparison operator is required",
    },
  ),

  value: z.union([z.string(), z.number(), z.array(z.string())], {
    message: "Filter criterion value is required",
  }),
});

export type SegmentFilterInput = z.infer<typeof segmentFilterSchema>;

/**
 * Audience segment definition schema
 */
export const segmentSchema = z.object({
  name: z
    .string({ message: "Segment name is required" })
    .trim()
    .min(1, "Segment name cannot be empty")
    .max(100, "Segment name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  filters: z.array(segmentFilterSchema).min(1, "At least one segment filter rule is required"),

  conjunction: z.enum(["and", "or"]).default("and"),
});

export type CreateSegmentInput = z.infer<typeof segmentSchema>;
