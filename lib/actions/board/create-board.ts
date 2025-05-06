"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { calculateDays, formatDateTime } from "@/lib/date"

import { Board } from "@/lib/database/models/board.model"
import { 
  CreateBoardFormValues,
  getCreateBoardSchema
} from "@/lib/validations/board"
import { createList } from "@/lib/actions/list/create-list"

export const createBoard = async (
  values: CreateBoardFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getCreateBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
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
    return { error:
      (error instanceof Error && error.message) ||
      tError("actionFailed") }
  }
}