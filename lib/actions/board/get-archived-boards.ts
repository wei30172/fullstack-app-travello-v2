"use server"

import { currentUser } from "@/lib/session"
import connectDB from "@/lib/db"

import { Board } from "@/lib/models/board.model"
import { IBoard } from "@/lib/models/types"

export const getArchivedBoards = async (): Promise<IBoard[]> => {
  const user = await currentUser()

  await connectDB()
  
  let boards = await Board.find({
    $or: [
      { userId: user?._id },
      { editors: user?.email }
    ],
    isArchived: true
  }).sort({ createdAt: -1 })
  
  boards = boards.map(board => {
    const boardObject = board.toObject()
    boardObject._id = boardObject._id.toString()

    return boardObject
  })

  // console.log({boards})
  return boards
}