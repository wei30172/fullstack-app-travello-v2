"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { List } from "@/lib/models/list.model"
import { Card } from "@/lib/models/card.model"
import { ICard } from "@/lib/models/types"
import { 
  CopyListFormValues,
  getCopyListSchema
} from "@/lib/validations/list"

export const copyList = async (
  values: CopyListFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getCopyListSchema().safeParse(values)

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

    // Copy the list
    const listToCopy = await List.findOne({ _id: id, boardId })
      .populate({
        path: 'cards',
        model: Card
      })
  
    if (!listToCopy) {
      return { error: tError("listNotFound") }
    }
    
    const lastList = await List.findOne({ boardId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field
  
    const newOrder = lastList ? lastList.order + 1 : 1
  
    const newList = new List({
      title: `${listToCopy.title} - Copy`,
      boardId: listToCopy.boardId,
      order: newOrder
    })

    // If the list contains cards, copy cards
    if (listToCopy.cards && listToCopy.cards.length > 0) {
      const copiedCardsData = listToCopy.cards.map((card: ICard) => ({
        title: card.title,
        order: card.order,
        description: card.description,
        listId: newList._id,
        isCompleted: false
      }))
  
      const copiedCards = await Card.insertMany(copiedCardsData)

      newList.cards = copiedCards.map(card => card._id)
    }

    const list = await newList.save()

    await Board.findByIdAndUpdate(
      boardId,
      { $push: { lists: list._id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: { title: list.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}