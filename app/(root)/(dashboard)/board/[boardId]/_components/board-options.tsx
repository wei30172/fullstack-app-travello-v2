"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { IBoard, BoardRole } from "@/lib/models/types"
import { deleteBoard } from "@/lib/actions/board/delete-board"
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
import { DeleteConfirmDialog } from "@/components/shared/delete-alert-dialog"
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

  const handleDeleteBoard = () => {
    if (boardData.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Deleting is restricted to authorized users only." })
      return
    }

    startTransition(() => {
      deleteBoard({ boardId: boardData._id })
        .then((res) => {
          if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const handleCopyBoard = () => {
    if (boardData.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Editing is restricted to authorized users only." })
      return
    }
    
    startTransition(() => {
      copyBoard({ boardId: boardData._id })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: "Trip copied!" })
            setIsPopoverOpen(false)
            router.push("/boards")
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
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
          <FiMoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 pt-3" 
        side="bottom" 
        align="start"
      >
        <div className="text-md font-medium text-center text-teal-600 pb-2">
          Manage Trip
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
          Copy Trip
        </Button>
        <DeleteConfirmDialog onConfirm={handleDeleteBoard}>
          <Button
            variant="destructive"
            className="w-full"
            disabled={isPending}>
            Delete Trip
          </Button>
        </DeleteConfirmDialog>
      </PopoverContent>
    </Popover>
  )
}