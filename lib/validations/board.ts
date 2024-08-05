import * as z from "zod"
import { BoardRole } from "@/lib/models/types"

export const CreateBoardValidation = z.object({
  title: z.string()
    .min(2, "Title must be 2+ characters")
    .max(100, "Title must be less than 100 characters"),
  location: z.string()
    .min(2, "Description must be 2+ characters")
    .max(100, "Description must be less than 100 characters"),
  startDate: z.date(),
  endDate: z.date(),
  imageUrl: z.optional(z.string())
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
})

export const UpdateBoardValidation = z.object({
  title:  z.optional(z.string()
    .min(2, "Title must be 2+ characters")
    .max(100, "Title must be less than 100 characters")),
  location:  z.optional(z.string()
    .min(2, "Description must be 2+ characters")
    .max(100, "Description must be less than 100 characters")),
  startDate:  z.optional(z.date()),
  endDate:  z.optional(z.date()),
  imageUrl: z.optional(z.string()),
  isArchived: z.optional(z.boolean()),
  boardId: z.string()
}).refine((data) => data.endDate == null || data.startDate == null || data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
})

export const DeleteBoardValidation = z.object({
  boardId: z.string()
})

export const CopyBoardValidation = z.object({
  boardId: z.string()
})

export const ShareBoardValidation = z.object({
  boardId: z.string(),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  role: z.enum([BoardRole.VIEWER, BoardRole.EDITOR])
})

export const UnShareBoardValidation = z.object({
  boardId: z.string(),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email")
})

export const AddMediaValidation = z.object({
  userId: z.string(),
  type: z.string(),
  url: z.string()
})

export const RemoveMediaValidation = z.object({
  url: z.string()
})