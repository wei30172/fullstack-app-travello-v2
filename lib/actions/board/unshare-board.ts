"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board, Invitation } from "@/lib/models/board.model"
import { TokenStatus } from "@/lib/models/types"
import { UnShareBoardValidation } from "@/lib/validations/board"

type SharedBoardInput = z.infer<typeof UnShareBoardValidation>

export const unshareBoard = async (
  values: SharedBoardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = UnShareBoardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { boardId, email } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: "Trip not found" }
    }

    if (board.userId.toString() !== user._id.toString()) {
      return { error: "Only the owner can unshare this trip." }
    }

    await Invitation.deleteMany({ boardId, email })

    const wasViewer = board.viewers.includes(email)
    const wasEditor = board.editors.includes(email)

    if (!wasViewer && !wasEditor) {
      return { success: "This email was not shared." }
    }

    board.viewers = board.viewers.filter((e: string) => e !== email)
    board.editors = board.editors.filter((e: string) => e !== email)

    await board.save()
    
    revalidatePath(`/board/${board._id.toString()}`)
    return { success: "Cancel sharing successfully." }

  } catch (error) {
    return { error: "Failed to unshare" }
  }
}
