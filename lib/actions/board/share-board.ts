"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { BoardRole } from "@/lib/models/types"
import { 
  ShareBoardFormValues,
  getShareBoardSchema
} from "@/lib/validations/board"
import { generateInvitation } from "@/lib/token"
import { sendInvitationEmail } from "@/lib/mail"

export const shareBoard = async (
  values:  ShareBoardFormValues
) => {
  const tServer = await getTranslations("BoardForm.server")
  const tRole = await getTranslations("BoardForm.role")
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getShareBoardSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { boardId, email, role } = validatedFields.data

  if (email === user.email) {
    return { error: tServer("error.cannotShareWithSelf") }
  }

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
    }

    if (board.userId.toString() !== user._id.toString()) {
      return { error: tServer("error.onlyOwnerCanShare") }
    }

    const updateRole = (newRole: BoardRole, addTo: string, removeFrom: string) => {
      if (board[addTo].includes(email)) {
        return { success: tServer("success.alreadyShared", { role: tRole(newRole) }) }
      }
      if (board[removeFrom].includes(email)) {
        board[removeFrom] = board[removeFrom].filter((e: string) => e !== email)
        board[addTo].push(email)
        board.save()
        return { success: tServer("success.roleUpdated", { role: tRole(newRole) }) }
      }
      return null
    }

    const updateResult = role === BoardRole.EDITOR
      ? updateRole(BoardRole.EDITOR, "editors", "viewers")
      : updateRole(BoardRole.VIEWER, "viewers", "editors")

    if (updateResult) {
      return updateResult
    }

    const invitationToken = await generateInvitation(boardId, email, role)
    await sendInvitationEmail(
      email,
      user.email!,
      invitationToken
    )

    return { success: tServer("success.invitationSent") }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}
