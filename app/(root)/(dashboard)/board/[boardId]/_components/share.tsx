"use client"

import { useState } from "react"
import { IBoard, BoardRole } from "@/lib/models/types"

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
import { IoMdClose } from "react-icons/io"

interface ShareProps {
  boardData: IBoard
}

export const Share = ({ boardData }: ShareProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

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
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[350px] pt-6" 
        side="bottom" 
        align="start"
      >
        <div className="text-md font-medium text-center text-teal-600 pb-2">
          Share {boardData.title || "Trip"}
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