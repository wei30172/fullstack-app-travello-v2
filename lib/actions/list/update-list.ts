"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { List } from "@/lib/models/list.model"
import { UpdateListValidation } from "@/lib/validations/list"

type UpdateListInput = z.infer<typeof UpdateListValidation>

export const updateList = async (
  values: UpdateListInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = UpdateListValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { title, id, boardId } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: "Editing is restricted to authorized users only." }
    }
    
    const list = await List.findOneAndUpdate(
      { _id: id, boardId },
      { title },
      { new: true } // Return updated document
    )

    revalidatePath(`/board/${boardId}`)
    return { data: { title: list.title } }

  } catch (error) {
    return { error: "Failed to update" }
  }
}