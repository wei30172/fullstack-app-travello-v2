"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { List } from "@/lib/models/list.model"
import { Card } from "@/lib/models/card.model"
import { ICard } from "@/lib/models/types"
import { CopyListValidation } from "@/lib/validations/list"

type CopyListInput = z.infer<typeof CopyListValidation>

export const copyList = async (
  values: CopyListInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = CopyListValidation.safeParse(values)

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
      return { error: "Editing is restricted to authorized users only." }
    }

    // Copy the list
    const listToCopy = await List.findOne({ _id: id, boardId })
      .populate({
        path: 'cards',
        model: Card
      })
  
    if (!listToCopy) {
      return { error: "List not found" }
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
    return { error: "Failed to copy" }
  }
}