"use server"

import { z } from "zod"

import connectDB from "@/lib/db"
import { Media } from "@/lib/models/board.model"
import { AddMediaValidation } from "@/lib/validations/board"

type AddMediaInput = z.infer<typeof AddMediaValidation>

export const addMedia = async (
  values: AddMediaInput
) => {
  const validatedFields = AddMediaValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  try {
    await connectDB()

    const media = new Media({ ...values })

    // console.log({media})
    await media.save()

    return { data: { _id: media._id.toString() } }
  } catch (error) {
    return { error: "Failed to save media information" }
  }
}