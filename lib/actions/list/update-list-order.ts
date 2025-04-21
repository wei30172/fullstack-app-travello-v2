"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { List } from "@/lib/models/list.model"
import {
  UpdateListOrderFormValues,
  getUpdateListOrderSchema
} from "@/lib/validations/list"

export const updateListOrder = async (
  values: UpdateListOrderFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getUpdateListOrderSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
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
    return { error: tError("actionFailed") }
  }
}