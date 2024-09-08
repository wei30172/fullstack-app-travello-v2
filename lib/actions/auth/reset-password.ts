"use server"

import { z } from "zod"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import { ResetPasswordValidation } from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/mail"

type ResetPasswordInput = z.infer<typeof ResetPasswordValidation>

export const resetPassword = async (values: ResetPasswordInput) => {
  const validatedFields = ResetPasswordValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }
  
  const { email } = validatedFields.data
  
  await connectDB()

  const existingUser = await User.findOne({email})

  if (!existingUser) {
    return { error: "Email not found!" }
  }

  if (existingUser.provider !== UserProvider.CREDENTIALS) {
    return { error: "Email has already been used for third-party login" }
  }
  
  const passwordResetToken = await generateToken({email})
  // console.log({passwordResetToken})

  await sendPasswordResetEmail(
    email,
    passwordResetToken
  )

  return { success: "Reset email sent!" }
}