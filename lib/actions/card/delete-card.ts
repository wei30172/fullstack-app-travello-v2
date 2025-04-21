"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { Card } from "@/lib/models/card.model"
import { List } from "@/lib/models/list.model"
import { 
  DeleteCardFormValues,
  getDeleteCardSchema
} from "@/lib/validations/card"

export const deleteCard = async (
  values: DeleteCardFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getDeleteCardSchema().safeParse(values)

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

    const card = await Card.findById(id)
    
    if (!card) {
      return { error: tError("cardNotFound") }
    }
  
    // Delete the Card itself
    await Card.findByIdAndDelete(id)

    // Remove the List's reference to the Card
    await List.findByIdAndUpdate(card.listId, {
      $pull: { cards: id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: { title: card.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}