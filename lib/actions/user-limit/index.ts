"use server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { UserLimit } from "@/lib/database/models/user.model"
import { MAX_FREE_ASKAI, MAX_FREE_COVER } from "@/constants/board"
import { CountType } from "@/lib/database/models/types"

const getUserLimit = async (userId: string) => {
  await connectDB()
  let userLimit = await UserLimit.findOne({ userId })
  if (!userLimit) {
    userLimit = new UserLimit({ userId, askAiCount: 0, boardCoverCount: 0 })
    await userLimit.save()
  }
  return userLimit
}

export const getAvailableAskAiCount = async (): Promise<number> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  const userLimit = await getUserLimit(user._id)
  return userLimit.askAiCount
}

export const getAvailableBoardCoverCount = async (): Promise<number> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  const userLimit = await getUserLimit(user._id)
  return userLimit.boardCoverCount
}

const checkCount = async (
  userId: string,
  field: CountType.ASK_AI_COUNT | CountType.BOARD_COVER_COUNT,
  maxCount: number
): Promise<boolean> => {
  const userLimit = await getUserLimit(userId)
  return userLimit[field] < maxCount
}

const updateCount = async (
  userId: string,
  field: CountType.ASK_AI_COUNT | CountType.BOARD_COVER_COUNT,
  increment: number
): Promise<number> => {
  const userLimit = await getUserLimit(userId)
  userLimit[field] = Math.max(0, userLimit[field] + increment)
  await userLimit.save()
  return userLimit[field]
}

export const hasAvailableAskAiCount = async (): Promise<boolean> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  return await checkCount(user._id, CountType.ASK_AI_COUNT, MAX_FREE_ASKAI)
}

export const hasAvailableBoardCoverCount = async (): Promise<boolean> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  return await checkCount(user._id, CountType.BOARD_COVER_COUNT, MAX_FREE_COVER)
}

export const incrementAskAiCount = async (): Promise<number> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  return await updateCount(user._id, CountType.ASK_AI_COUNT, 1)
}

export const incrementBoardCoverCount = async (): Promise<number> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  return await updateCount(user._id, CountType.BOARD_COVER_COUNT, 1)
}

export const decreaseBoardCoverCount = async (userId: string): Promise<number> => {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  return await updateCount(userId, CountType.BOARD_COVER_COUNT, -1)
}