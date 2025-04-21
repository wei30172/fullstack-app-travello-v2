import * as z from "zod"
import { BoardRole } from "@/lib/models/types"

export function getCreateBoardSchema(t?: (key: string) => string) {
  return z
    .object({
      title: z
        .string()
        .min(2, t?.("title.min") || "Title must be 2+ characters")
        .max(100, t?.("title.max") || "Title must be less than 100 characters"),
      location: z
        .string()
        .min(2, t?.("location.min") || "Description must be 2+ characters")
        .max(100, t?.("location.max") || "Description must be less than 100 characters"),
      startDate: z.date(),
      endDate: z.date(),
      imageUrl: z.optional(z.string())
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: t?.("endDate.invalid") || "End date must be after start date",
      path: ["endDate"]
    })
}
export type CreateBoardFormValues = z.infer<ReturnType<typeof getCreateBoardSchema>>

export function getUpdateBoardSchema(t?: (key: string) => string) {
  return z
    .object({
      title: z.optional(
        z
          .string()
          .min(2, t?.("title.min") || "Title must be 2+ characters")
          .max(100, t?.("title.max") || "Title must be less than 100 characters")
      ),
      location: z.optional(
        z
          .string()
          .min(2, t?.("location.min") || "Description must be 2+ characters")
          .max(100, t?.("location.max") || "Description must be less than 100 characters")
      ),
      startDate: z.optional(z.date()),
      endDate: z.optional(z.date()),
      imageUrl: z.optional(z.string()),
      isArchived: z.optional(z.boolean()),
      boardId: z.string()
    })
    .refine(
      (data) => data.endDate == null || data.startDate == null || data.endDate >= data.startDate,
      {
        message: t?.("endDate.invalid") || "End date must be after start date",
        path: ["endDate"]
      }
    )
}
export type UpdateBoardFormValues = z.infer<ReturnType<typeof getUpdateBoardSchema>>

export function getDeleteBoardSchema() {
  return z.object({
    boardId: z.string()
  })
}
export type DeleteBoardFormValues = z.infer<ReturnType<typeof getDeleteBoardSchema>>

export function getCopyBoardSchema() {
  return z.object({
    boardId: z.string()
  })
}
export type CopyBoardFormValues = z.infer<ReturnType<typeof getCopyBoardSchema>>

export function getShareBoardSchema(t?: (key: string) => string) {
  return z.object({
    boardId: z.string(),
    email: z
      .string()
      .min(1, t?.("email.required") || "Email is required")
      .email(t?.("email.invalid") || "Invalid email"),
    role: z.enum([BoardRole.VIEWER, BoardRole.EDITOR])
  })
}
export type ShareBoardFormValues = z.infer<ReturnType<typeof getShareBoardSchema>>

export function getUnshareBoardSchema(t?: (key: string) => string) {
  return z.object({
    boardId: z.string(),
    email: z
      .string()
      .min(1, t?.("email.required") || "Email is required")
      .email(t?.("email.invalid") || "Invalid email")
  })
}
export type UnshareBoardFormValues = z.infer<ReturnType<typeof getUnshareBoardSchema>>

export function getAddMediaSchema() {
  return z.object({
    userId: z.string(),
    type: z.string(),
    url: z.string()
  })
}
export type AddMediaFormValues = z.infer<ReturnType<typeof getAddMediaSchema>>

export function getRemoveMediaSchema() {
  return z.object({
    url: z.string()
  })
}
export type RemoveMediaFormValues = z.infer<ReturnType<typeof getRemoveMediaSchema>>