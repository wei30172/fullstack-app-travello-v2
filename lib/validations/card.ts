import * as z from "zod"

export const CreateCardValidation = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(2, "Title must be 2+ characters")
    .max(100, "Title must be less than 100 characters"),
  boardId: z.string(),
  listId: z.string(),
  order: z.optional(z.number())
})

export const DeleteCardValidation = z.object({
  id: z.string(),
  boardId: z.string()
})

export const UpdateCardValidation = z.object({
  title: z.optional(
    z.string()
    .min(1, "Title is required")
    .min(2, "Title must be 2+ characters")
    .max(100, "Title must be less than 100 characters"),
  ),
  description: z.optional(
    z.string()
    .max(300, "Description must be less than 300 characters"),
  ),
  boardId: z.string(),
  id: z.string(),
  isCompleted: z.optional(z.boolean()),
  color: z.optional(z.string())
})

export const UpdateCardOrderValidation = z.object({
  cards: z.array(
    z.object({
      _id: z.string(),
      order: z.number(),
      listId: z.string()
    })
  ),
  boardId: z.string()
})

export const CopyCardValidation = z.object({
  id: z.string(),
  boardId: z.string()
})