import { z } from "zod";

export const RegSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .min(1, "Email is required")
      .email("Invalid email address"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .refine((val) => !/\s/.test(val), {
        message: "Username cannot contain spaces",
      }),

    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters long"),

    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters long"),

    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters")
      .optional(),

    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,10}$/, "Invalid phone number")
      .optional(),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (val) =>
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val),
        {
          message:
            "Password must contain uppercase, lowercase, and number",
        }
      ),

    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"], // attach error to this field
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });