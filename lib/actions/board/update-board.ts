"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { UpdateBoardValidation } from "@/lib/validations/board"

type UpdateBoardInput = z.infer<typeof UpdateBoardValidation>

export const updateBoard = async (
  values: UpdateBoardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = UpdateBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { boardId, title, location, startDate, endDate, imageUrl, isArchived } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: "This function is restricted to authorized users only." }
    }

    const boardToUpdate = await Board.findByIdAndUpdate(
      boardId,
      { $set: { title, location, startDate, endDate, imageUrl, isArchived } }, // Only update provided content
      { new: true, omitUndefined: true } // Return updated document, updating only the provided content
    )
    // console.log({id, board})

    if (!boardToUpdate) {
      return { error: "Trip not found" }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: { title: boardToUpdate.title } }

  } catch (error) {
    return { error: "Failed to update" }
  }
}