"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Card } from "@/lib/models/card.model"
import { List } from "@/lib/models/list.model"
import { Board } from "@/lib/models/board.model"
import { DeleteListValidation } from "@/lib/validations/list"

type DeleteListInput = z.infer<typeof DeleteListValidation>

export const deleteList = async (
  values: DeleteListInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = DeleteListValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { id, boardId } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)
    
    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: "Deleting is restricted to authorized users only." }
    }
    
    const list = await List.findById(id)
    
    if (!list) {
      return { error: "List not found" }
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
    return { error: "Failed to delete" }
  }
}