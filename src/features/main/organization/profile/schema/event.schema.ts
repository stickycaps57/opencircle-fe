import { z } from "zod";

/**
 * Base schema for common event form validation
 */
const baseEventSchema = {
  title: z
    .string()
    .min(1, { message: "Event title is required" })
    .max(100, { message: "Event title must be less than 100 characters" }),
  event_date: z.string().min(1, { message: "Event date is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  province: z.string().min(1, { message: "Province is required" }),

  // ✅ optional fields
  city: z.string().optional(),
  barangay: z.string().optional(),

  house_building_number: z
    .string()
    .min(1, { message: "House/Building number is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  
  // country_code and province_code are required, city_code and barangay_code are optional
  country_code: z.string().min(1, { message: "Country code is required" }),
  province_code: z.string().min(1, { message: "Province code is required" }),
  city_code: z.string().optional(),
  barangay_code: z.string().optional(),
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
 * Schema for creating an event (image required)
 */
export const createEventSchema = z.object({
  ...baseEventSchema,
  image: imageValidation,
});

/**
 * Schema for editing an event (image optional)
 */
export const editEventSchema = z.object({
  ...baseEventSchema,
  image: imageValidation.optional(),
});

/**
 * Type definition for event creation form data
 */
export type CreateEventFormData = z.infer<typeof createEventSchema>;

/**
 * Type definition for event editing form data
 */
export type EditEventFormData = z.infer<typeof editEventSchema>;

/**
 * Combined type for event form data
 */
export type EventFormData = CreateEventFormData | EditEventFormData;

/**
 * Type for event form mode (create or edit)
 */
export type EventFormMode = "create" | "edit";
