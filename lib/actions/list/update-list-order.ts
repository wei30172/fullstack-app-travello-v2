"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { List } from "@/lib/models/list.model"
import { UpdateListOrderValidation } from "@/lib/validations/list"

type UpdateListOrderInput = z.infer<typeof UpdateListOrderValidation>

export const updateListOrder = async (
  values: UpdateListOrderInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = UpdateListOrderValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { lists, boardId } = validatedFields.data

  try {
    await connectDB()

    const updateOperations = lists.map(list => 
      List.updateOne(
        { _id: list._id },
        { $set: { order: list.order } }
      )
    )
  
    // Executes multiple promises in parallel,
    // returning a single promise that resolves when all of the input promises have resolved,
    // or rejects if any input promise rejects.
    await Promise.all(updateOperations)
  
    revalidatePath(`/board/${boardId}`)
    return { data: { id: boardId } }

  } catch (error) {
    return { error: "Failed to reorder" }
  }
}