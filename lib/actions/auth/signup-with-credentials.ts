"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import { SignUpValidation } from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"

type SignUpWithCredentialsInput = z.infer<typeof SignUpValidation>

export const signUpWithCredentials = async (values: SignUpWithCredentialsInput) => {
  const validatedFields = SignUpValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }
  
  const { email, password, name } = validatedFields.data

  await connectDB()

  const existingUser = await User.findOne({email})
  if (existingUser) {
    const error = existingUser.provider === UserProvider.CREDENTIALS 
      ? "Email already exists" 
      : "Email has already been used for third-party login"
    return { error }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = new User({ name, email, password: hashedPassword })
  await user.save()

  const verificationToken = await  generateToken({email})
  // console.log({verificationToken})

  await sendVerificationEmail(
    email,
    verificationToken
  )
  
  return { success: "Confirmation email sent!" }
}