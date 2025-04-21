"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { Card } from "@/lib/models/card.model"
import { 
  UpdateCardFormValues,
  getUpdateCardSchema
} from "@/lib/validations/card"

export const updateCard = async (
  values: UpdateCardFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getUpdateCardSchema().safeParse(values)


  if (!validatedFields.success) {
    return {
      error: tError("invalidFields"),
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
      return { error: tError("unauthorized") }
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
    return { error: tError("actionFailed") }
  }
}