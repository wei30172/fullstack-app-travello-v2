"use server"

import { currentUser } from "@/lib/session"
import connectDB from "@/lib/database/db"
import { Board } from "@/lib/database/models/board.model"
import { IBoard, BoardRole } from "@/lib/database/models/types"

export const getSharedBoards = async (): Promise<IBoard[]> => {
  const user = await currentUser()

  await connectDB()

  const boards = await Board.find({
    $or: [
      { viewers: user?.email },
      { editors: user?.email }
    ]
  }).sort({ createdAt: -1 })

  const sharedBoards = boards.map(board => {
    const boardObject = board.toObject()
    boardObject._id = boardObject._id.toString()

    let role = BoardRole.VIEWER
    if (board.editors.includes(user?.email)) {
      role = BoardRole.EDITOR
    }
    boardObject.role = role

    return boardObject
  })

  // console.log({boards})
  return sharedBoards
}