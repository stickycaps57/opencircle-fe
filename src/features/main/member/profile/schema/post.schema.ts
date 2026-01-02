import { z } from "zod";

/**
 * Base schema for common post form validation
 */
const basePostSchema = {
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
};

/**
 * Image validation schema with refinements
 */
const imageValidation = z
  .instanceof(File, { message: "Image is required" })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  });

/**
 * Schema for creating a post (image required)
 */
export const createPostSchema = z.object({
  ...basePostSchema,
  images: z.array(imageValidation).max(10, { message: "You can upload up to 10 images" }).optional(),
});

/**
 * Schema for editing a post (image optional)
 */
export const editPostSchema = z.object({
  ...basePostSchema,
  images: z.array(imageValidation).max(10, { message: "You can upload up to 10 images" }).optional(),
});

/**
 * Combined schema for backward compatibility
 * This is no longer used directly but kept for API compatibility
 */
export const postFormSchema = z.object({
  ...basePostSchema,
  images: z.array(imageValidation).max(10).optional(),
});

/**
 * Type definitions for post form data
 */
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type EditPostFormData = z.infer<typeof editPostSchema>;

// Use a union type for the combined form data
export type PostFormData = CreatePostFormData | EditPostFormData;

/**
 * Type for post form mode (create or edit)
 */
export type PostFormMode = "create" | "edit";
