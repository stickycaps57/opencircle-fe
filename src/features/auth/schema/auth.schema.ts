import { z } from "zod";

// Login form validation schema
export const loginSchema = z.object({
  login: z
    .string()
    .min(1, { message: "Email/Username is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Login form data type
export type LoginFormData = z.infer<typeof loginSchema>;
