import { z } from "zod";

/**
 * Message content payload schema
 */
export const messageContentSchema = z.object({
  text: z.string().trim().max(4096, "Message cannot exceed 4096 characters").optional(),

  caption: z.string().trim().max(1024, "Caption cannot exceed 1024 characters").optional(),

  mediaUrl: z
    .string()
    .trim()
    .url("Media URL must be a valid web address")
    .optional()
    .or(z.literal("")),

  mediaMimeType: z.string().optional(),
  fileName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  templateName: z.string().optional(),
  templateVariables: z.record(z.string(), z.string()).optional(),
});

export type MessageContentInput = z.infer<typeof messageContentSchema>;

/**
 * Outbound message dispatch validation schema
 */
export const messageSchema = z
  .object({
    type: z.enum(
      [
        "text",
        "image",
        "video",
        "document",
        "audio",
        "template",
        "interactive",
        "location",
        "contact",
      ],
      {
        message: "Message type is required",
      },
    ),

    content: messageContentSchema,
  })
  .refine(
    (data) => {
      if (data.type === "text") {
        return Boolean(data.content.text && data.content.text.trim().length > 0);
      }
      return true;
    },
    {
      message: "Text message content is required and cannot be empty",
      path: ["content", "text"],
    },
  );

export type SendMessageInput = z.infer<typeof messageSchema>;
