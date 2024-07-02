import { IBoard, BoardRole } from "@/lib/models/types"

import { BoardTitleForm } from "./board-title-form"
import { Share } from "./share"
import { BoardOptions } from "./board-options"
import { BoardBanner } from "./board-banner"

interface BoardNavbarProps {
  boardData: IBoard
}

export const BoardNavbar = ({ boardData }: BoardNavbarProps) => {
  return (
    <div className="w-full fixed top-14 z-[50]">
      <div className="h-14 bg-teal-700 flex items-center px-6 gap-x-4 text-white">
        <BoardTitleForm boardData={boardData} />
        <div className="ml-auto flex items-center gap-1">
          <Share boardData={boardData} /> 
          {(boardData.role === BoardRole.EDITOR || boardData.role === BoardRole.OWNER) &&
          <BoardOptions boardData={boardData} />}
        </div>
      </div>
      {boardData.isArchived && (
        <BoardBanner boardId={boardData._id} />
      )}
    </div>
  )
}