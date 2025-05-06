"use server"

import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"

export const getUserEmailById = async (userId: string) => {
  await connectDB()

  const user = await User.findById(userId)
  return user ? user.email : null
}
