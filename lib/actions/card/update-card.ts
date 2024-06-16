"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { Card } from "@/lib/models/card.model"
import { UpdateCardValidation } from "@/lib/validations/card"

type UpdateCardInput = z.infer<typeof UpdateCardValidation>

export const updateCard = async (
  values: UpdateCardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = UpdateCardValidation.safeParse(values)


  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }
  
  const { id, boardId, ...updateData } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: "Editing is restricted to authorized users only." }
    }

    const card = await Card.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return updated document
    )

    revalidatePath(`/board/${boardId}`)
    return { data: {
      ...card._doc,
      _id: card._id.toString(),
      listId: card.listId.toString()
    }}

  } catch (error) {
    return { error: "Failed to update" }
  }
}