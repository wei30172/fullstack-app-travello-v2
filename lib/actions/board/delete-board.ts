"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"

import { Card } from "@/lib/database/models/card.model"
import { List } from "@/lib/database/models/list.model"
import { Board } from "@/lib/database/models/board.model"
import { 
  DeleteBoardFormValues,
  getDeleteBoardSchema
} from "@/lib/validations/board"

export const deleteBoard = async (
  values: DeleteBoardFormValues
) => {
  const tError = await getTranslations("Common.error")
  
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getDeleteBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { boardId } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
    }


    // Find the IDs of all Lists belonging to this Board
    const lists = await List.find({ boardId }).select("_id")

    // Extract all List IDs from results
    const listIds = lists.map(list => list._id)
    
    // Delete all related Cards using these List IDs
    await Card.deleteMany({ listId: { $in: listIds } })

    // Delete all Lists related to this Board
    await List.deleteMany({ boardId })

    // Delete the Board itself
    await Board.findByIdAndDelete(boardId)

    revalidatePath("/boards")
    return { data: { title: board.title } }
    
  } catch (error) {
    return { error: tError("actionFailed") }
  }
}