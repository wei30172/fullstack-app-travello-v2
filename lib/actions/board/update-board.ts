"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { 
  UpdateBoardFormValues,
  getUpdateBoardSchema
} from "@/lib/validations/board"

export const updateBoard = async (
  values: UpdateBoardFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getUpdateBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { boardId, title, location, startDate, endDate, imageUrl, isArchived } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
    }

    const boardToUpdate = await Board.findByIdAndUpdate(
      boardId,
      { $set: { title, location, startDate, endDate, imageUrl, isArchived } }, // Only update provided content
      { new: true, omitUndefined: true } // Return updated document, updating only the provided content
    )
    // console.log({id, board})

    if (!boardToUpdate) {
      return { error: tError("boardNotFound") }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: { title: boardToUpdate.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}