import * as z from "zod"

export const CreateListValidation = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(2, "Title must be 2+ characters")
    .max(100, "Title must be less than 100 characters"),
  boardId: z.string(),
  cardTitles: z.optional(z.array(z.string()))
})

export const DeleteListValidation = z.object({
  id: z.string(),
  boardId: z.string()
})

export const UpdateListValidation = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(2, "Title must be 2+ characters")
    .max(100, "Title must be less than 100 characters"),
  id: z.string(),
  boardId: z.string()
})

export const UpdateListOrderValidation = z.object({
  lists: z.array(
    z.object({
      _id: z.string(),
      order: z.number()
    })
  ),
  boardId: z.string()
})

export const CopyListValidation = z.object({
  id: z.string(),
  boardId: z.string()
})