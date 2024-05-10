"use server"

import connectDB from "@/lib/db"
import { verifyToken, isTokenError } from "@/lib/token"
import { User } from "@/lib/models/auth.model"

export const newVerification = async (token: string) => {
  const res = await verifyToken(token)
  // console.log({res})

  if (isTokenError(res)) {
    return { error: res.error }
  }
  
  await connectDB()

  const existingUser =await User.findOne({email: res.email})

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  await User.findByIdAndUpdate(existingUser._id, {
    emailVerified: new Date(),
    email: res.email
  })

  return { success: "Email verified!" }
}
