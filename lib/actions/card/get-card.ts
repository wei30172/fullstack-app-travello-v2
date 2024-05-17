"use server"

import mongoose from "mongoose"
import connectDB from "@/lib/db"
import Card from "@/lib/models/card.model"
import List from "@/lib/models/list.model"
import Board from "@/lib/models/board.model"
import { CardWithList } from "@/lib/models/types"

export const getCard = async (cardId: string): Promise<CardWithList | null> => {
  await connectDB()

  // console.log({cardId})
  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
    console.error('Invalid cardId:', cardId)
    return null
  }

  const card = await Card.findById(cardId).populate({
    path: "listId",
    model: List,
    select: "title boardId",
    populate: {
      path: "boardId",
      model: Board,
      select: "userId"
    }
  })

  if (!card) {
    console.log("Card not found")
    return null
  }

  const cardObject: CardWithList = {
    ...card.toObject(),
    _id: card._id.toString(),
    listId: card.listId._id.toString(),
    list: {
      title: card.listId.title
    }
  }

  // console.log({cardObject})
  return cardObject
}