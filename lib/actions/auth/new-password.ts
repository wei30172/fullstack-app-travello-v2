"use server"

import bcrypt from "bcryptjs"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { verifyToken, isTokenError } from "@/lib/token"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import { NewPasswordFormValues, getNewPasswordFormSchema } from "@/lib/validations/auth"

export const newPassword = async (
  values: NewPasswordFormValues,
  token?: string | null
) => {
  const t = await getTranslations("NewPasswordForm.server")
  const tokenError = await getTranslations("SomeForm.server.error")

  const validatedFields = getNewPasswordFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: t("error.invalid-fields") }
  }

  if (!token) {
    return { error: tokenError("missing-token") }
  }

  const res = await verifyToken(token)
  // console.log({res})

  if (isTokenError(res)) {
    return { error: tokenError(`${res.error}`) }
  }

  await connectDB()
  
  const existingUser = await User.findOne({email: res.email})

  if (!existingUser) {
    return { error: t("error.email-not-found") }
  }

  if (existingUser.provider !== UserProvider.CREDENTIALS) {
    return { error: t("error.third-party") }
  }
  
  const { newPassword } = validatedFields.data

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  await User.findByIdAndUpdate(existingUser._id,
    { password: hashedPassword }
  )

  return { success: t("success.password-updated") }
}