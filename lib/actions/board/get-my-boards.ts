"use server"

import { currentUser } from "@/lib/session"
import connectDB from "@/lib/database/db"
import { Board } from "@/lib/database/models/board.model"
import { IBoard } from "@/lib/database/models/types"

export const getMyBoards = async (): Promise<IBoard[]> => {
  const user = await currentUser()

  await connectDB()
  
  let boards = await Board.find({
    userId: user?._id,
    isArchived: false
  }).sort({ createdAt: -1 })

  boards = boards.map(board => {
    const boardObject = board.toObject()
    boardObject._id = boardObject._id.toString()

    return boardObject
  })

  // console.log({boards})
  return boards
}