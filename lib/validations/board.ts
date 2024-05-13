import * as z from "zod"

export const CreateBoardValidation = z.object({
  title: z.string()
    .min(3, "Title must be 3+ characters")
    .max(100, "Title must be less than 100 characters"),
  location: z.string()
    .min(3, "Description must be 3+ characters")
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
    .min(3, "Title must be 3+ characters")
    .max(100, "Title must be less than 100 characters")),
  location:  z.optional(z.string()
    .min(3, "Description must be 3+ characters")
    .max(100, "Description must be less than 100 characters")),
  startDate:  z.optional(z.date()),
  endDate:  z.optional(z.date()),
  imageUrl: z.optional(z.string()),
  id: z.string()
}).refine((data) => data.endDate == null || data.startDate == null || data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
})

export const DeleteBoardValidation = z.object({
  boardId: z.string()
})