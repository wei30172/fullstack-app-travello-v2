"use server"
import bcrypt from "bcryptjs"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import { SignUpFormValues, getSignUpFormSchema } from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"

export const signUpWithCredentials = async (
  values: SignUpFormValues
) => {
  const t = await getTranslations("SignUpForm.server")

  const validatedFields = getSignUpFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: t("error.invalid-fields") }
  }
  
  const { email, password, name } = validatedFields.data

  await connectDB()
  
  const existingUser = await User.findOne({email})
  if (existingUser) {
    const error = existingUser.provider === UserProvider.CREDENTIALS 
      ? t("error.email-exists")
      : t("error.email-third-party")
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
  
  return { success: t("success.confirmation-sent") }
}