import { IBoard, BoardRole } from "@/lib/models/types"

import { BoardTitleForm } from "./board-title-form"
import { Share } from "./share"
import { UnshareSelf } from "./unshare-self"
import { BoardOptions } from "./board-options"

interface BoardNavbarProps {
  boardData: IBoard
}

export const BoardNavbar = ({ boardData }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[50] bg-teal-700 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm boardData={boardData} />
      <div className="ml-auto flex items-center gap-1">
        {boardData.role === BoardRole.OWNER ? (
          <Share boardData={boardData} /> 
        ) : (
          <UnshareSelf boardId={boardData._id} />
        )}
        {(boardData.role === BoardRole.EDITOR || boardData.role === BoardRole.OWNER) &&
        <BoardOptions boardData={boardData} />}
      </div>
    </div>
  )
}