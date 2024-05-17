import { IBoard } from "@/lib/models/types"

import { BoardTitleForm } from "./board-title-form"
import { BoardOptions } from "./board-options"

interface BoardNavbarProps {
  boardData: IBoard
}

export const BoardNavbar = ({ boardData }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[50] bg-teal-700 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm boardData={boardData} />
      <div className="ml-auto">
        <BoardOptions boardData={boardData} />
      </div>
    </div>
  )
}