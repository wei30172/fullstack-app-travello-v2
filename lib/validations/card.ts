import * as z from "zod"

export function getCreateCardSchema(t?: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .min(1, t?.("title.required") || "Title is required")
      .min(2, t?.("title.min") || "Title must be 2+ characters")
      .max(100, t?.("title.max") || "Title must be less than 100 characters"),
    boardId: z.string(),
    listId: z.string(),
    order: z.optional(z.number())
  })
}
export type CreateCardFormValues = z.infer<ReturnType<typeof getCreateCardSchema>>

export function getUpdateCardSchema(t?: (key: string) => string) {
  return z.object({
    title: z.optional(
      z
        .string()
        .min(1, t?.("title.required") || "Title is required")
        .min(2, t?.("title.min") || "Title must be 2+ characters")
        .max(100, t?.("title.max") || "Title must be less than 100 characters")
    ),
    description: z.optional(
      z
        .string()
        .max(300, t?.("description.max") || "Description must be less than 300 characters")
    ),
    boardId: z.string(),
    id: z.string(),
    isCompleted: z.optional(z.boolean()),
    color: z.optional(z.string())
  })
}
export type UpdateCardFormValues = z.infer<ReturnType<typeof getUpdateCardSchema>>

export function getDeleteCardSchema() {
  return z.object({
    id: z.string(),
    boardId: z.string()
  })
}
export type DeleteCardFormValues = z.infer<ReturnType<typeof getDeleteCardSchema>>

export function getCopyCardSchema() {
  return z.object({
    id: z.string(),
    boardId: z.string()
  })
}
export type CopyCardFormValues = z.infer<ReturnType<typeof getCopyCardSchema>>

export function getUpdateCardOrderSchema() {
  return z.object({
    cards: z.array(
      z.object({
        _id: z.string(),
        order: z.number(),
        listId: z.string()
      })
    ),
    boardId: z.string()
  })
}
export type UpdateCardOrderFormValues = z.infer<ReturnType<typeof getUpdateCardOrderSchema>>