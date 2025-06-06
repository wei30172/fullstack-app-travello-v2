"use server"

import mongoose from "mongoose"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/database/models/board.model"
import { IBoard, BoardRole } from "@/lib/database/types"

export const getBoard = async (boardId: string): Promise<IBoard | null> => {
  const user = await currentUser()
  
  if (!user) {
    console.error("User not authenticated")
    return null
  }

  await connectDB()

  // console.log({boardId})
  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    console.error("Invalid boardId:", boardId)
    return null
  }

  const board = await Board.findOne({
    _id: boardId,
    $or: [
      { userId: user?._id },
      { editors: user?.email },
      { viewers: user?.email }
    ]
  })

  if (!board) {
    console.log("Trip not found")
    return null
  }

  const boardObject = board.toObject()
  boardObject._id = boardObject._id.toString()
  boardObject.userId = boardObject.userId.toString()

  if (boardObject.lists) {
    boardObject.lists = boardObject.lists.map((id: mongoose.Types.ObjectId) => id.toString())
  }

  if (boardObject.userId === user?._id.toString()) {
    boardObject.role = BoardRole.OWNER
  } else if (boardObject.editors.includes(user?.email)) {
    boardObject.role = BoardRole.EDITOR
  } else if (boardObject.viewers.includes(user?.email)) {
    boardObject.role = BoardRole.VIEWER
  }
  
  // console.log({boardObject})
  return boardObject
}