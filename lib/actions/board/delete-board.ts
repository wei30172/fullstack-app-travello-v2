"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"

import Card from "@/lib/models/card.model"
import List from "@/lib/models/list.model"
import Board from "@/lib/models/board.model"
import { DeleteBoardValidation } from "@/lib/validations/board"

type DeleteBoardInput = z.infer<typeof DeleteBoardValidation>

export const deleteBoard = async (
  values: DeleteBoardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = DeleteBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { boardId } = validatedFields.data

  try {
    await connectDB()

    // Find the IDs of all Lists belonging to this Board
    const lists = await List.find({ boardId }).select('_id')

    // Extract all List IDs from results
    const listIds = lists.map(list => list._id)
    
    // Delete all related Cards using these List IDs
    await Card.deleteMany({ listId: { $in: listIds } })

    // Delete all Lists related to this Board
    await List.deleteMany({ boardId })

    // Delete the Board itself
    await Board.findByIdAndDelete(boardId)

    revalidatePath("/boards")
    redirect("/boards")

  } catch (error) {
    return { error: "Failed to delete" }
  }
}