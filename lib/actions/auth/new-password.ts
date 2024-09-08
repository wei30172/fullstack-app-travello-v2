"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/db"
import { verifyToken, isTokenError } from "@/lib/token"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import { NewPasswordValidation } from "@/lib/validations/auth"

type NewPasswordInput = z.infer<typeof NewPasswordValidation>

export const newPassword = async (
  values: NewPasswordInput,
  token?: string | null
) => {
  const validatedFields = NewPasswordValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  if (!token) {
    return { error: "Missing token!" }
  }

  const res = await verifyToken(token)
  // console.log({res})

  if (isTokenError(res)) {
    return { error: res.error }
  }

  await connectDB()
  
  const existingUser = await User.findOne({email: res.email})

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  if (existingUser.provider !== UserProvider.CREDENTIALS) {
    return { error: "Email has already been used for third-party login" }
  }
  
  const { newPassword } = validatedFields.data

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  await User.findByIdAndUpdate(existingUser._id,
    { password: hashedPassword }
  )

  return { success: "Password updated!" }
}