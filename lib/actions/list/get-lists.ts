"use server"

import connectDB from "@/lib/db"
import { List } from "@/lib/models/list.model"
import { Card } from "@/lib/models/card.model"
import { ICard, ListWithCards } from "@/lib/models/types"

type Result<T> = { data: T } | { error: string }

export const getLists = async (boardId: string): Promise<Result<ListWithCards[]>> => {
  try {
    await connectDB()

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
    return { data: lists as ListWithCards[] }

  } catch (error) {
    return { error: "Failed to get lists" }
  }
}