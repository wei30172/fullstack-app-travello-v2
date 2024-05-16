"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import Board from "@/lib/models/board.model"
import List from "@/lib/models/list.model"
import Card from "@/lib/models/card.model"
import { ICard } from "@/lib/models/types"
import { CopyBoardValidation } from "@/lib/validations/board"

type CopyBoardInput = z.infer<typeof CopyBoardValidation>

export const copyBoard = async (
  values: CopyBoardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = CopyBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { boardId } = validatedFields.data

  try {
    await connectDB()

    // Copy the board
    const boardToCopy = await Board.findById(boardId)
      .populate({
        path: 'lists',
        model: List
      })
  
    if (!boardToCopy) {
      return { error: "Board not found" }
    }
  
    const newBoard = new Board({
      title: `${boardToCopy.title} - Copy`,
      location: boardToCopy.location,
      startDate: boardToCopy.startDate,
      endDate: boardToCopy.endDate,
      userId: user?._id
    })

    const board = await newBoard.save()

    const listsToCopy = await List.find({
      _id: { $in: boardToCopy.lists }
    }).populate({
      path: 'cards',
      model: Card
    })

    // Copy each list and its cards
    for (let listToCopy of listsToCopy) {
      const newList = new List({
        title: listToCopy.title,
        boardId: newBoard._id,
        order: listToCopy.order
      })

      // If the list contains cards, copy cards
      if (listToCopy.cards && listToCopy.cards.length > 0) {
        const copiedCardsData = listToCopy.cards.map((card: ICard) => ({
          title: card.title,
          order: card.order,
          description: card.description,
          listId: newList._id
        }))

        const copiedCards = await Card.insertMany(copiedCardsData)

        newList.cards = copiedCards.map(card => card._id)
      }

      const list = await newList.save()

      await Board.findByIdAndUpdate(
        boardId,
        { $push: { lists: list._id }
      })
    }

    revalidatePath("/boards")
    return { data: { title: board.title } }

  } catch (error) {
    return { error: "Failed to copy" }
  }
}