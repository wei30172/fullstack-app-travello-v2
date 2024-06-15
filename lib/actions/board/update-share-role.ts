"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { BoardRole } from "@/lib/models/types"
import { ShareBoardValidation } from "@/lib/validations/board"

type UpdateShareRoleInput = z.infer<typeof ShareBoardValidation>

export const updateShareRole = async (
  values: UpdateShareRoleInput
) => {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = ShareBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { boardId, email, role } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: "Trip not found" }
    }

    if (board.userId.toString() !== user._id.toString()) {
      return { error: "Only the owner can update roles." }
    }

    if (!board.viewers.includes(email) && !board.editors.includes(email)) {
      return { error: "User not found in viewers or editors." }
    }

    const updateRole = (newRole: BoardRole, addTo: string, removeFrom: string) => {
      if (board[addTo].includes(email)) {
        return { success: `This email is already shared as a ${newRole}.` }
      }
      if (board[removeFrom].includes(email)) {
        board[removeFrom] = board[removeFrom].filter((e: string) => e !== email)
      }
      board[addTo].push(email)
      board.save()
      return { success: `Role updated to ${newRole}.` }
    }

    const updateResult = role === BoardRole.EDITOR
      ? updateRole(BoardRole.EDITOR, "editors", "viewers")
      : updateRole(BoardRole.VIEWER, "viewers", "editors")

    if (updateResult) {
      revalidatePath(`/board/${board._id.toString()}`)
      return updateResult
    }

    return { error: "Failed to update role" }
    
  } catch (error) {
    return { error: "Failed to update role" }
  }
}