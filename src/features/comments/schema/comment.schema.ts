import { z } from "zod";

// Zod schema for comment posting form validation
export const postCommentSchema = z.object({
  post_id: z
    .number()
    .min(1, { message: "Post ID is required" })
    .int({ message: "Post ID must be an integer" })
    .positive({ message: "Post ID must be positive" })
    .optional(),
  event_id: z
    .number()
    .min(1, { message: "Event ID is required" })
    .int({ message: "Event ID must be an integer" })
    .positive({ message: "Event ID must be positive" })
    .optional(),
  message: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(500, { message: "Comment must be less than 500 characters" }),
}).refine(
  (data) => data.post_id || data.event_id,
  {
    message: "Either post_id or event_id must be provided",
    path: ["post_id", "event_id"],
  }
);

// Zod schema for comment editing form validation
export const editCommentSchema = z.object({
  comment_id: z
    .number()
    .min(1, { message: "Comment ID is required" })
    .int({ message: "Comment ID must be an integer" })
    .positive({ message: "Comment ID must be positive" }),
  message: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});

// Type definition for comment posting form data
export type PostCommentFormData = z.infer<typeof postCommentSchema>;

// Type definition for comment editing form data
export type EditCommentFormData = z.infer<typeof editCommentSchema>;
