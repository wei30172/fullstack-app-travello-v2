"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useCoverModal } from "@/hooks/use-cover-modal"
import { removeMedia } from "@/lib/actions/board/remove-media"
import { updateBoard } from "@/lib/actions/board/update-board"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { IoImage, IoTrashBin } from "react-icons/io5"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"

interface BoardImageProps {
  url?: string
  onClose: () => void
}

const BoardImage = ({
  url,
  onClose
}: BoardImageProps) => {
  const params = useParams()
  const { toast } = useToast()
  
  const [isPending, startTransition] = useTransition()
  const coverImage =  useCoverModal()

  const handleOpen = () => {
    coverImage.onOpen()
    onClose()
  }

  const handleRemove = async () => {
    const boardId = params.boardId as string

    if (url) {
      startTransition(async () => {
        try {
          const res = await removeMedia(url)
          if (res?.success) {
            const updateRes = await updateBoard({ imageUrl: "", boardId })
            if (updateRes?.data) {
              toast({ status: "success", title: "Media removed and board updated successfully!" })
              onClose()
            } else {
              throw new Error(updateRes?.error || "Update failed")
            }
          } else {
            throw new Error(res?.error || "Removal failed")
          }
        } catch (error) {
          toast({ status: "error", description: (error as Error).message || "Something went wrong" })
        }
      })
    }
  }

  return (
    <div className={cn(
      "relative aspect-video h-full w-full group rounded-lg overflow-hidden mb-4",
      !url && "h-[0px]",
      url && "bg-muted"
    )}>
    {!!url && (
      <Image
        src={url}
        fill
        alt="BoardImage"
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    )}
    {url && (
      <div className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 flex items-center gap-x-2">
        <Button
          onClick={handleOpen}
          className="text-muted-foreground p-2 rounded-full shadow-md"
          variant="outline"
          size="sm"
          disabled={isPending}
        >
          <IoImage className="h-4 w-4" />
        </Button>
        <ConfirmDialog onConfirm={handleRemove} actiontitle="Remove Cover">
          <Button
            className="text-muted-foreground p-2 rounded-full shadow-md"
            variant="outline"
            size="sm"
            disabled={isPending}
          >
            <IoTrashBin className="h-4 w-4" />
          </Button>
        </ConfirmDialog>
      </div>
    )}
    </div>
  )
}

BoardImage.Skeleton = function BoardImageSkeleton() {
  return (
    <Skeleton className="aspect-video h-full w-full rounded-lg mb-4" />
  )
}

export default BoardImage