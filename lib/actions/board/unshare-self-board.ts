"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"

type UnShareSelfInput = {
  boardId: string
}

export const unshareSelf = async (values: UnShareSelfInput) => {
  const tServer = await getTranslations("BoardForm.server")
  const tError = await getTranslations("Common.error")

  const user = await currentUser()

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const { boardId } = values

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
    }

    const wasViewer = board.viewers.includes(user.email)
    const wasEditor = board.editors.includes(user.email)

    if (!wasViewer && !wasEditor) {
      return { error: tServer("error.userNotInList") }
    }

    board.viewers = board.viewers.filter((e: string) => e !== user.email)
    board.editors = board.editors.filter((e: string) => e !== user.email)

    await board.save()

    revalidatePath("/boards")

    const removedRole = wasEditor ? "editor" : "viewer"
    return { data: { role: removedRole } }

  } catch (error) {
    return { error: tError("actionFailed") }
  }
}