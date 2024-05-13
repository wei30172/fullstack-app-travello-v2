import * as z from "zod"

export const CreateCardValidation = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be 3+ characters")
    .max(100, "Title must be less than 100 characters"),
  boardId: z.string(),
  listId: z.string()
})

export const DeleteCardValidation = z.object({
  id: z.string(),
  boardId: z.string()
})

export const UpdateCardValidation = z.object({
  boardId: z.string(),
  description: z.optional(
    z.string()
    .min(1, "Description is required")
    .min(3, "Description must be 3+ characters")
    .max(300, "Description must be less than 300 characters"),
  ),
  title: z.optional(
    z.string()
    .min(1, "Title is required")
    .min(3, "Title must be 3+ characters")
    .max(100, "Title must be less than 100 characters"),
  ),
  id: z.string()
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