"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { Board, Invitation } from "@/lib/models/board.model"
import { TokenStatus, BoardRole } from "@/lib/models/types"

export const acceptInvitation = async (
  token: string
) => {
  const t = await getTranslations("AcceptShareForm.server")
  const tError = await getTranslations("Common.error")

  try {
    await connectDB()

    const invitation = await Invitation.findOne({
      token, status: TokenStatus.PENDING
    })

    if (!invitation) {
      return { error: t("error.invalid") }
    }

    const hasExpired = new Date(invitation.expires) < new Date()
    
    if (hasExpired) {
      invitation.status = TokenStatus.EXPIRED
      await invitation.save()
      
      return { error: t("error.expired") }
    }

    const board = await Board.findById(invitation.boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
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
    return { success: t("success.joinedRedirect") , boardId: invitation.boardId }
    
  } catch (error) {
    return { error: tError("actionFailed") }
  }
}