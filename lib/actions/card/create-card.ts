"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/database/models/board.model"
import { List } from "@/lib/database/models/list.model"
import { Card } from "@/lib/database/models/card.model"
import { 
  CreateCardFormValues,
  getCreateCardSchema
} from "@/lib/validations/card"

export const createCard = async (
  values: CreateCardFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getCreateCardSchema().safeParse(values)

  if (!validatedFields.success) {
    return {
      error: tError("invalidFields"),
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { title, boardId, listId, order } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)
    
    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
    }
    
    const list = await List.findById(listId)
    
    if (!list) {
      return { error: tError("listNotFound") }
    }
    
    let newOrder = order
    if (newOrder === undefined) {
      const lastCard = await Card.findOne({ listId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field
      newOrder = lastCard ? lastCard.order + 1 : 0
    }

    const card = new Card({ title, listId, order: newOrder })
    // console.log({card})

    await card.save()

    await List.findByIdAndUpdate(
      listId,
      { $push: { cards: card._id }
    })

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