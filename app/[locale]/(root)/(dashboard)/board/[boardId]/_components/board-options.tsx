"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { IBoard, BoardRole } from "@/lib/database/types"
import { updateBoard } from "@/lib/actions/board/update-board"
import { copyBoard } from "@/lib/actions/board/copy-board"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { BoardForm } from "@/components/shared/board-form"
import { FiMoreHorizontal } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"

interface BoardOptionsProps {
  boardData: IBoard
}

export const BoardOptions = ({ boardData }: BoardOptionsProps) => {
  // console.log({boardData})
  const router = useRouter()
  const { toast } = useToast()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("BoardForm.ui")
  const tToast = useTranslations("BoardForm.toast")
  const tError = useTranslations("Common.error")
  
  const handleArchiveBoard = () => {
    if (boardData.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }

    startTransition(() => {
      updateBoard({
        isArchived: true,
        boardId: boardData._id
      })
      .then((res) => {
        if (res?.data) {
          toast({ status: "success", title: tToast("success.archived") })
          setIsPopoverOpen(false)
        } else if (res?.error) {
          toast({ status: "error", description: res?.error })
        }
      })
      .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const handleCopyBoard = () => {
    if (boardData.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }
    
    startTransition(() => {
      copyBoard({ boardId: boardData._id })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: tToast("success.copied") })
            setIsPopoverOpen(false)
            router.push("/boards")
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

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
          aria-label="More options"
          onClick={() => setIsPopoverOpen(true)}
        >
          <FiMoreHorizontal className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[350px] pt-3 max-h-[32rem] overflow-y-auto" 
        side="bottom" 
        align="start"
      >
        <div className="text-md font-medium text-center text-teal-600 pb-2">
          {tUi("manageTrip")}
        </div>
        
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
        <BoardForm
          type="Update"
          onClose={() => setIsPopoverOpen(false)}
          boardData={boardData}
        />
        <Separator />
        <Button
          onClick={handleCopyBoard}
          variant="outline"
          className="w-full mt-4 mb-2"
          disabled={isPending}
        >
          {tUi("copyTrip")}
        </Button>
        <Button
          onClick={handleArchiveBoard}
          variant="destructive"
          className="w-full"
          disabled={isPending}
        >
          {tUi("deleteTrip")}
        </Button>
      </PopoverContent>
    </Popover>
  )
}