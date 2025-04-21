"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { List } from "@/lib/models/list.model"
import { Card } from "@/lib/models/card.model"
import { Board } from "@/lib/models/board.model"
import { ICard, ListWithCards, BoardRole } from "@/lib/models/types"

type Result<T> = { data: T; role: BoardRole } | { error: string }

export const getLists = async (boardId: string): Promise<Result<ListWithCards[]>> => {
  const tError = await getTranslations("Common.error")

  try {
    await connectDB()

    const user = await currentUser()

    if (!user) {
      return { error: tError("unauthorized") }
    }

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
    }

    let role = BoardRole.VIEWER

    if (board.userId.toString() === user._id.toString()) {
      role = BoardRole.OWNER
    } else if (board.editors.includes(user.email)) {
      role = BoardRole.EDITOR
    }

    let lists = await List.find({ boardId })
    .populate({
      path: 'cards',
      model: Card,
      options: { sort: { order: 'asc' } } // Sort by 'order' in ascending order
    })
    .sort({ order: 'asc' }) // Sort by 'order' in ascending order
    
    lists = lists.map(list => {
      let listObject = list.toObject()
      listObject._id = listObject._id.toString()
      listObject.boardId = listObject.boardId.toString()
      
      listObject.cards = listObject.cards.map((card: ICard) => {
        card._id = card._id.toString()
        card.listId = card.listId.toString()

        // console.log({card})
        return card
      })

      return listObject
    })

    // console.log({lists})
    return { data: lists as ListWithCards[], role}

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}