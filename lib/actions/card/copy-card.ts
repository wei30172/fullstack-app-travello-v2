"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { List } from "@/lib/models/list.model"
import { Card } from "@/lib/models/card.model"
import { 
  CopyCardFormValues,
  getCopyCardSchema
} from "@/lib/validations/card"

export const copyCard = async (
  values: CopyCardFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getCopyCardSchema().safeParse(values)

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

    const cardToCopy = await Card.findById(id)
    if (!cardToCopy) { return { error: tError("cardNotFound") } }
    
    const lastCard = await Card.findOne({ listId: cardToCopy.listId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field

    const newOrder = lastCard ? lastCard.order + 1 : 0

    const card = new Card({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      listId: cardToCopy.listId,
      order: newOrder
    })

    await card.save()

    await List.findByIdAndUpdate(
      card.listId,
      { $push: { cards: card._id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: { title: card.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}