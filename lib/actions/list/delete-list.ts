"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Card } from "@/lib/database/models/card.model"
import { List } from "@/lib/database/models/list.model"
import { Board } from "@/lib/database/models/board.model"
import {
  DeleteListFormValues,
  getDeleteListSchema
} from "@/lib/validations/list"

export const deleteList = async (
  values: DeleteListFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getDeleteListSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { id, boardId } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)
    
    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
    }
    
    const list = await List.findById(id)
    
    if (!list) {
      return { error: tError("listNotFound") }
    }

    // Delete all Cards related to this List
    await Card.deleteMany({ listId: id })

    // Delete the List itself
    await List.findByIdAndDelete(id)

    // Remove the Board's reference to the List
    await Board.findByIdAndUpdate(boardId, {
      $pull: { lists: id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: { title: list.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}