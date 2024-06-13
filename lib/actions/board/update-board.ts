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

  const { id, title, location, startDate, endDate, imageUrl } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findByIdAndUpdate(
      id,
      { $set: { title, location, startDate, endDate, imageUrl } }, // Only update provided content
      { new: true, omitUndefined: true } // Return updated document, updating only the provided content
    )
    // console.log({id, board})

    if (!board) {
      return { error: "Trip not found" }
    }

    revalidatePath(`/board/${id}`)
    return { data: { title: board.title } }

  } catch (error) {
    return { error: "Failed to update" }
  }
}