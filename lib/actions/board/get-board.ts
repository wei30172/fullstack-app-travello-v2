"use server"

import mongoose from "mongoose"
import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"

import Board from "@/lib/models/board.model"
import { IBoard } from "@/lib/models/types"


export const getBoard = async (boardId: string): Promise<IBoard | null> => {
  const user = await currentUser()
  
  await connectDB()

  // console.log({boardId})
  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    console.error('Invalid boardId:', boardId)
    return null
  }

  const board = await Board.findOne({ _id: boardId, userId: user?._id })

  if (!board) {
    console.log("Trip not found")
    return null
  }

  const boardObject = board.toObject()
  boardObject._id = boardObject._id.toString()
  boardObject.userId = boardObject.userId._id.toString()

  if (boardObject.lists) {
    boardObject.lists = boardObject.lists.map((id: mongoose.Types.ObjectId) => id.toString())
  }
  
  // console.log({boardObject})
  return boardObject
}