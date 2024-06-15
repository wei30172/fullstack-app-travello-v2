"use server"

import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { Board, Invitation } from "@/lib/models/board.model"
import { TokenStatus, BoardRole } from "@/lib/models/types"

export const acceptInvitation = async (
  token: string
) => {
  try {
    await connectDB()

    const invitation = await Invitation.findOne({
      token, status: TokenStatus.PENDING
    })

    if (!invitation) {
      return { error: "Invalid or expired invitation" }
    }

    const hasExpired = new Date(invitation.expires) < new Date()
    
    if (hasExpired) {
      invitation.status = TokenStatus.EXPIRED
      await invitation.save()
      
      return { error: "Invitation has expired" }
    }

    const board = await Board.findById(invitation.boardId)

    if (!board) {
      return { error: "Trip not found" }
    }

    if (invitation.role === BoardRole.VIEWER && !board.viewers.includes(invitation.email)) {
      board.viewers.push(invitation.email)
    }

    if (invitation.role === BoardRole.EDITOR && !board.editors.includes(invitation.email)) {
      board.editors.push(invitation.email)
    } 
    
    await board.save()

    invitation.status = TokenStatus.ACCEPTED
    await invitation.save()

    revalidatePath(`/board/${board._id.toString()}`)
    return { success: "Trip accepted.", boardId: invitation.boardId }
    
  } catch (error) {
    return { error: "Failed to accept share" }
  }
}