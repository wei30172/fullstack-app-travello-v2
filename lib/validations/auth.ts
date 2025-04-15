import * as z from "zod"
import { UserRole } from "@/lib/models/types"

export function getSignInFormSchema(t?: (key: string) => string) {
  return z
  .object({
    email: z
      .string()
      .min(1, t?.("email.required") || "Email is required")
      .email(t?.("email.invalid") || "Invalid email"),
    password: z
      .string()
      .min(1, t?.("password.required") || "Password is required")
      .min(8, t?.("password.invalid") || "Password must be 8+ characters"),
    code: z.string().optional().default("")
  })
}

export type SignInFormValues = z.infer<ReturnType<typeof getSignInFormSchema>>

export function getSignUpFormSchema(t?: (key: string) => string) {
  return z
    .object({
      name: z
        .string()
        .min(1, t?.("name.required") || "Username is required")
        .max(50, t?.("name.invalid") || "Username must be less than 50 characters"),
      email: z
        .string()
        .min(1, t?.("email.required") || "Email is required")
        .email(t?.("email.invalid") || "Invalid email"),
      password: z
        .string()
        .min(1, t?.("password.required") || "Password is required")
        .min(8, t?.("password.invalid") || "Password must be 8+ characters"),
      confirmPassword: z
        .string()
        .min(1, t?.("confirm-password.required") || "Password confirmation is required")
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t?.("confirm-password.invalid") || "Password do not match"
    })
}

export type SignUpFormValues = z.infer<ReturnType<typeof getSignUpFormSchema>>

export function getResetFormSchema(t?: (key: string) => string) {
  return z
    .object({
      email: z
        .string()
        .min(1, t?.("email.required") || "Email is required")
        .email(t?.("email.invalid") || "Invalid email")
    })
}

export type ResetFormValues = z.infer<ReturnType<typeof getResetFormSchema>>

export function getNewPasswordFormSchema(t?: (key: string) => string) {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, t?.("new-password.required") || "Password is required")
        .min(8, t?.("new-password.invalid") || "Password must be 8+ characters"),
      confirmPassword: z
        .string()
        .min(1, t?.("confirm-password.required") || "Password confirmation is required")
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t?.("confirm-password.invalid") || "Passwords do not match"
    })
}


export type NewPasswordFormValues = z.infer<ReturnType<typeof getNewPasswordFormSchema>>

const validatePassword = (t?: (key: string) => string) =>
  z
    .string()
    .refine((val) => val === "" || val.length >= 8, {
      message: t?.("password.invalid") || "Password must be 8+ characters if provided"
    })

export function getSettingsFormSchema(t?: (key: string) => string) {
  return z
    .object({
      name: z.optional(z.string()),
      email: z.optional(
        z.string().email(t?.("email.invalid") || "Invalid email")
      ),
      password: z.optional(validatePassword(t)),
      newPassword: z.optional(validatePassword(t)),
      role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.MEMBER]),
      isTwoFactorEnabled: z.optional(z.boolean())
    })
    .refine(
      (data) => !(data.newPassword && !data.password),
      {
        path: ["password"],
        message:
          t?.("password.required") ||
          "To change password, enter current one."
      }
    )
    .refine(
      (data) => !(data.password && !data.newPassword),
      {
        path: ["newPassword"],
        message:
          t?.("new-password.required") ||
          "To change password, enter new password."
      }
    )
}

export type SettingsFormValues = z.infer<ReturnType<typeof getSettingsFormSchema>>