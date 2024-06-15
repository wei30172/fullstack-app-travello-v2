"use server"

import { z } from "zod"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { BoardRole } from "@/lib/models/types"
import { ShareBoardValidation } from "@/lib/validations/board"
import { generateInvitation } from "@/lib/token"
import { sendInvitationEmail } from "@/lib/mail"

type SharedBoardInput = z.infer<typeof ShareBoardValidation>

export const shareBoard = async (
  values: SharedBoardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = ShareBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { boardId, email, role } = validatedFields.data

  if (email === user.email) {
    return { error: "Cannot share the trip with yourself." }
  }

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: "Trip not found" }
    }

    if (board.userId.toString() !== user._id.toString()) {
      return { error: "Only the owner can share this trip." }
    }

    const updateRole = (newRole: BoardRole, addTo: string, removeFrom: string) => {
      if (board[addTo].includes(email)) {
        return { success: `This email is already shared as a ${newRole}.` }
      }
      if (board[removeFrom].includes(email)) {
        board[removeFrom] = board[removeFrom].filter((e: string) => e !== email)
        board[addTo].push(email)
        board.save()
        return { success: `Role updated to ${newRole}.` }
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

    return { success: "Invite email sent!" }

  } catch (error) {
    return { error: "Failed to share" }
  }
}
