"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { Media } from "@/lib/database/models/board.model"
import { 
  AddMediaFormValues,
  getAddMediaSchema
} from "@/lib/validations/board"

export const addMedia = async (
  values: AddMediaFormValues
) => {
  const tError = await getTranslations("Common.error")

  const validatedFields = getAddMediaSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  try {
    await connectDB()

    const media = new Media({ ...values })

    // console.log({media})
    await media.save()

    return { data: { _id: media._id.toString() } }
  } catch (error) {
    return { error: tError("actionFailed") }
  }
}