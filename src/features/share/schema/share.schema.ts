import { z } from "zod";

export const sharePostSchema = z.object({
  content_id: z.number().positive(),
  comment: z.string().min(1, "Description is required"),
  content_type: z.number().int().min(1).max(2),
});

export type SharePostFormData = z.infer<typeof sharePostSchema>;
