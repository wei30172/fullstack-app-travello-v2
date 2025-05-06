"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/database/models/board.model"
import { List } from "@/lib/database/models/list.model"
import { Card } from "@/lib/database/models/card.model"
import { ICard } from "@/lib/database/models/types"
import { 
  CopyBoardFormValues,
  getCopyBoardSchema
} from "@/lib/validations/board"

export const copyBoard = async (
  values: CopyBoardFormValues
) => {
  const tError = await getTranslations("Common.error")
  
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getCopyBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
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
      return { error: tError("boardNotFound") }
    }
  
    if (
      boardToCopy.userId.toString() !== user._id.toString() &&
      !boardToCopy.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
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
    }

    revalidatePath("/boards")
    return { data: { title: board.title } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}