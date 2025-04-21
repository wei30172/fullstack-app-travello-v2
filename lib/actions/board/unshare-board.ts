"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board, Invitation } from "@/lib/models/board.model"
import { 
  UnshareBoardFormValues,
  getUnshareBoardSchema
} from "@/lib/validations/board"

export const unshareBoard = async (
  values: UnshareBoardFormValues
) => {
  const tServer = await getTranslations("BoardForm.server")
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getUnshareBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { boardId, email } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
    }

    if (board.userId.toString() !== user._id.toString()) {
      return { error: tServer("error.onlyOwnerCanUnshare") }
    }

    await Invitation.deleteMany({ boardId, email })

    const wasViewer = board.viewers.includes(email)
    const wasEditor = board.editors.includes(email)

    if (!wasViewer && !wasEditor) {
      return { error: tServer("error.userNotInList") }
    }

    board.viewers = board.viewers.filter((e: string) => e !== email)
    board.editors = board.editors.filter((e: string) => e !== email)

    await board.save()
    
    revalidatePath(`/board/${board._id.toString()}`)
    return { success: tServer("success.unshared") }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}