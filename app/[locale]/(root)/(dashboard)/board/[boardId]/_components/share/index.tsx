"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { IBoard, BoardRole } from "@/lib/database/types"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BoardOwner } from "./board-owner"
import { ShareForm } from "./share-form"
import { UnshareSelf } from "./unshare-self"
import { FiShare2 } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"

interface ShareProps {
  boardData: IBoard
}

export const Share = ({ boardData }: ShareProps) => {
  const tRole = useTranslations("BoardForm.role")
  const tUi = useTranslations("BoardForm.ui")

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const roleLabel = boardData.role === BoardRole.OWNER ? tRole("owner")
                  : boardData.role === BoardRole.EDITOR ? tRole("editor") : tRole("viewer")

  return (
    <Popover open={isPopoverOpen} onOpenChange={
      // Only changes state when open, closing is controlled by the close button
      (open) => {
        if (open) {
          setIsPopoverOpen(true)
        }
      }
    }>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto p-2"
          variant="transparent"
          aria-label="Share board"
          onClick={() => setIsPopoverOpen(true)}
        >
          <FiShare2 className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[350px] relative pt-6" 
        side="bottom" 
        align="start"
      >
        <div className="text-md font-medium text-center text-teal-600 py-2">
          {tUi("shareTitle", { title: boardData.title || "Trip" })}
        </div>
        <div className="absolute top-2 left-2 bg-black/50 text-white border dark:border-white text-xs px-2 py-1 rounded">
          {roleLabel}
        </div>
        <BoardOwner userId={boardData.userId} />
        <PopoverClose asChild>
          <Button 
            className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900"
            variant="ghost"
            aria-label="Close popover"
            onClick={() => setIsPopoverOpen(false)}
          >
            <IoMdClose className="h-4 w-4" />
          </Button>
        </PopoverClose>
        {boardData.role === BoardRole.OWNER ? (
          <ShareForm boardData={boardData} />
        ) : (
          <UnshareSelf boardId={boardData._id} />
        )}
        
      </PopoverContent>
    </Popover>
  )
}