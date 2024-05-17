"use server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { UserLimit } from "@/lib/models/user.model"
import { MAX_FREE_ASKAI } from "@/constants/board"

export const hasAvailableCount = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await connectDB()

  const userLimit = await UserLimit.findOne({
    userId: user._id
  })

  if (!userLimit || userLimit.count < MAX_FREE_ASKAI) {
    return true
  } else {
    return false
  }
}

export const incrementAvailableCount = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await connectDB()

  const userLimit = await UserLimit.findOne({
    userId: user._id
  })
  // console.log({userLimit})

  if (userLimit) {
    await UserLimit.findOneAndUpdate(
      { userId: user._id },
      { count: userLimit.count + 1 }
    )
  } else {
    const userLimit = new UserLimit({
      userId: user._id,
      count: 1
    })
    await userLimit.save()
  }
}

export const decreaseAvailableCount = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await connectDB()

  const userLimit = await UserLimit.findOne({
    userId: user._id
  })

  if (userLimit) {
    await UserLimit.findOneAndUpdate(
      { userId: user._id },
      { count: userLimit.count > 0 ? userLimit.count - 1 : 0 }
    )
  } else {
    const userLimit = new UserLimit({
      userId: user._id,
      count: 1
    })
    await userLimit.save()
  }
}

export const getAvailableCount = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await connectDB()
  
  const userLimit = await UserLimit.findOne({
    userId: user._id
  })
  
  if (!userLimit) {
    return 0
  }

  return userLimit.count
}