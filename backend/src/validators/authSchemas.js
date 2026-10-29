import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[0-9]/, "Password needs a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password needs an uppercase letter")
      .regex(/[0-9]/, "Password needs a number"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

  export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[0-9]/, "Password needs a number"),
});