"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { calculateDays, formatDateTime } from "@/lib/utils"

import Board from "@/lib/models/board.model"
import { CreateBoardValidation } from "@/lib/validations/board"
import { createList } from "@/lib/actions/list/create-list"

type CreateBoardInput = z.infer<typeof CreateBoardValidation>

export const createBoard = async (
  values: CreateBoardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = CreateBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  try {
    await connectDB()

    const board = new Board({
      ...values,
      userId: user?._id
    })
    
    // console.log({board})
    await board.save()

    const days = calculateDays(values.startDate, values.endDate)
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(values.startDate.getTime() + i * (1000 * 60 * 60 * 24))
      const { dateOnly } = formatDateTime(currentDate)

      const listData = {
        title: `Day ${i + 1}: ${dateOnly}`,
        boardId: board._id.toString()
      }

      const listResult = await createList(listData)
      if (listResult.error) {
        throw new Error(listResult.error)
      }
    }

    revalidatePath(`/board/${board._id.toString()}`)
    return { data: { _id: board._id.toString() } }

  } catch (error) {
    return { error: "Failed to create" }
  }
}