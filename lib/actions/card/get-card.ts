"use server"

import mongoose from "mongoose"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Card } from "@/lib/database/models/card.model"
import { List } from "@/lib/database/models/list.model"
import { Board } from "@/lib/database/models/board.model"
import { CardWithList, BoardRole } from "@/lib/database/types"

export const getCard = async (cardId: string): Promise<CardWithList | null> => {
  await connectDB()

  // console.log({cardId})
  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
    console.error("Invalid cardId:", cardId)
    return null
  }

  const card = await Card.findById(cardId).populate({
    path: "listId",
    model: List,
    select: "title boardId",
    populate: {
      path: "boardId",
      model: Board,
      select: "userId editors viewers"
    }
  })

  if (!card) {
    console.log("Card not found")
    return null
  }

  const user = await currentUser()
  if (!user) {
    console.log("Unauthorized")
    return null
  }

  const board = card.listId.boardId

  let role = BoardRole.VIEWER

  if (board.userId.toString() === user._id.toString()) {
    role = BoardRole.OWNER
  } else if (board.editors.includes(user.email)) {
    role = BoardRole.EDITOR
  }

  const cardObject: CardWithList = {
    ...card.toObject(),
    _id: card._id.toString(),
    listId: card.listId._id.toString(),
    list: {
      title: card.listId.title
    },
    role
  }

  // console.log({cardObject})
  return cardObject
}