import * as z from "zod"

export function getCreateListSchema(t?: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .min(1, t?.("title.required") || "Title is required")
      .min(2, t?.("title.min") || "Title must be 2+ characters")
      .max(100, t?.("title.max") || "Title must be less than 100 characters"),
    boardId: z.string(),
    cardTitles: z.optional(z.array(z.string()))
  })
}
export type CreateListFormValues = z.infer<ReturnType<typeof getCreateListSchema>>

export function getUpdateListSchema(t?: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .min(1, t?.("title.required") || "Title is required")
      .min(2, t?.("title.min") || "Title must be 2+ characters")
      .max(100, t?.("title.max") || "Title must be less than 100 characters"),
    id: z.string(),
    boardId: z.string()
  })
}
export type UpdateListFormValues = z.infer<ReturnType<typeof getUpdateListSchema>>

export function getDeleteListSchema() {
  return z.object({
    id: z.string(),
    boardId: z.string()
  })
}
export type DeleteListFormValues = z.infer<ReturnType<typeof getDeleteListSchema>>

export function getCopyListSchema() {
  return z.object({
    id: z.string(),
    boardId: z.string()
  })
}
export type CopyListFormValues = z.infer<ReturnType<typeof getCopyListSchema>>

export function getUpdateListOrderSchema() {
  return z.object({
    lists: z.array(
      z.object({
        _id: z.string(),
        order: z.number()
      })
    ),
    boardId: z.string()
  })
}
export type UpdateListOrderFormValues = z.infer<ReturnType<typeof getUpdateListOrderSchema>>