"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { BoardRole } from "@/lib/models/types"
import { 
  ShareBoardFormValues,
  getShareBoardSchema
} from "@/lib/validations/board"

export const updateShareRole = async (
  values: ShareBoardFormValues
) => {
  const tServer = await getTranslations("BoardForm.server")
  const tRole = await getTranslations("BoardForm.role")
  const tError = await getTranslations("Common.error")

  const user = await currentUser()

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getShareBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { boardId, email, role } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
    }

    if (board.userId.toString() !== user._id.toString()) {
      return { error: tServer("error.onlyOwnerCanUpdateRole") }
    }

    const wasViewer = board.viewers.includes(email)
    const wasEditor = board.editors.includes(email)

    if (!wasViewer && !wasEditor) {
      return { error: tServer("error.userNotInList") }
    }

    const updateRole = (newRole: BoardRole, addTo: string, removeFrom: string) => {
      if (board[addTo].includes(email)) {
        return { success: tServer("success.alreadyShared", { role: tRole(newRole) }) }
      }
      if (board[removeFrom].includes(email)) {
        board[removeFrom] = board[removeFrom].filter((e: string) => e !== email)
      }
      board[addTo].push(email)
      board.save()
      return { success: tServer("success.roleUpdated", { role: tRole(newRole) }) }
    }

    const updateResult = role === BoardRole.EDITOR
      ? updateRole(BoardRole.EDITOR, "editors", "viewers")
      : updateRole(BoardRole.VIEWER, "viewers", "editors")

    if (updateResult) {
      revalidatePath(`/board/${board._id.toString()}`)
      return updateResult
    }

    return { error: tError("actionFailed") }
    
  } catch (error) {
    return { error: tError("actionFailed") }
  }
}