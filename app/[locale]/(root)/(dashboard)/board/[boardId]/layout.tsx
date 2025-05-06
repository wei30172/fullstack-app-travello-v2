import { notFound } from "next/navigation"
import { BoardRole } from "@/lib/database/models/types"
import { getBoard } from "@/lib/actions/board/get-board"

import { cn } from "@/lib/utils"
import { BoardNavbar } from "./_components/board-navbar"

export async function generateMetadata({ 
  params
 }: {
  params: { boardId: string }
 }) {
  const board = await getBoard(params.boardId)

  return {
    title: board?.title || "Trip",
  }
}

const BoardIdLayout = async ({
  children,
  params
}: {
  children: React.ReactNode
  params: { boardId: string }
}) => {
  const board = await getBoard(params.boardId)
  // console.log({board})

  if (!board) {
    notFound()
  }

  const isEditorOrOwner = board.role === BoardRole.EDITOR || board.role === BoardRole.OWNER

  return (
    <div
      className="relative h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: board.imageUrl ? `url(${board.imageUrl})` : "none" }}
    >
      <BoardNavbar boardData={board} />
      <div className="absolute inset-0 bg-black/10" />
      <div className={cn("relative pb-16 h-full", board.isArchived && isEditorOrOwner ? "pt-40" : "pt-28")}>
        {children}
      </div>
    </div>
  )
}

export default BoardIdLayout