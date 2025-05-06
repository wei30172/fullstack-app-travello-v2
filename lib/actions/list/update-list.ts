"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/database/models/board.model"
import { List } from "@/lib/database/models/list.model"
import { 
  UpdateListFormValues,
  getUpdateListSchema
} from "@/lib/validations/list"

export const updateList = async (
  values: UpdateListFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getUpdateListSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { title, id, boardId } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
    }
    
    const list = await List.findOneAndUpdate(
      { _id: id, boardId },
      { title },
      { new: true } // Return updated document
    )

    revalidatePath(`/board/${boardId}`)
    return { data: { title: list.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}