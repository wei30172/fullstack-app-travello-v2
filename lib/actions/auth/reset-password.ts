"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import { ResetFormValues, getResetFormSchema } from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/mail"

export const resetPassword = async (
  values: ResetFormValues
) => {
  const t = await getTranslations("ResetForm.server")
  
  const validatedFields = getResetFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: t("error.invalid-fields") }
  }
  
  const { email } = validatedFields.data
  
  await connectDB()

  const existingUser = await User.findOne({email})

  if (!existingUser) {
    return { error: t("error.email-not-found") }
  }

  if (existingUser.provider !== UserProvider.CREDENTIALS) {
    return { error: t("error.third-party") }
  }
  
  const passwordResetToken = await generateToken({email})
  // console.log({passwordResetToken})

  await sendPasswordResetEmail(
    email,
    passwordResetToken
  )

  return { success: t("success.reset-sent") }
}