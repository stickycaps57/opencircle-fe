import { z } from "zod";
import { organizationCategoryOptions } from "@src/shared/enums/organizationCategories";

export const organizationSignupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Organization name is required" })
    .max(100, {
      message: "Organization name must be less than 100 characters",
    }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
  category: z.enum(organizationCategoryOptions as [string, ...string[]], {
    message: "Please select a valid category",
  }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Invalid email format" })),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" })
    .max(30, { message: "Username must be at most 30 characters" })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Only letters, numbers, and underscores allowed",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role_id: z.number().min(1, { message: "Role id is required" }),
  logo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Logo must be less than 5MB",
    })
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Logo must be an image file",
    }),
});

// Organization signup form data type
export type OrganizationSignupFormData = z.infer<
  typeof organizationSignupSchema
>;

export const memberSignupSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  bio: z
    .string()
    .min(1, { message: "Bio is required" })
    .max(500, { message: "Bio must be less than 500 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Invalid email format" })),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" })
    .max(30, { message: "Username must be at most 30 characters" })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Only letters, numbers, and underscores allowed",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role_id: z.number().min(1, { message: "Role id is required" }),
  profile_picture: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Profile picture must be less than 5MB",
    })
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Profile picture must be an image file",
    }),
});

export const otpVerificationSchema = z.object({
  otp_code: z
    .string()
    .min(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain digits only"),
  email: z.string().min(1, { message: "Email is required" }),
});

// Member signup form data type
export type MemberSignupFormData = z.infer<typeof memberSignupSchema>;

// Member signup form data type
export type OtpSignupVerificationFormData = z.output<typeof otpVerificationSchema>;