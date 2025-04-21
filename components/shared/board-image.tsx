"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { useCoverModal } from "@/hooks/use-cover-modal"
import { useTranslations } from "next-intl"
import { removeMedia } from "@/lib/actions/board/remove-media"
import { updateBoard } from "@/lib/actions/board/update-board"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { IoImage, IoTrashBin } from "react-icons/io5"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Spinner } from "@/components/shared/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface BoardImageProps {
  url?: string
  onClose: () => void
  isUpdating: boolean
}

const BoardImage = ({
  url,
  onClose,
  isUpdating
}: BoardImageProps) => {
  const params = useParams()
  const { toast } = useToast()
  
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("BoardForm.ui")
  const tToast = useTranslations("BoardForm.toast")
  const tError = useTranslations("Common.error")

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
              toast({ status: "success", title: tToast("success.coverRemoved") })
              onClose()
            } else {
              throw new Error(updateRes?.error || tToast("error.updateFailed"))
            }
          } else {
            throw new Error(res?.error || tToast("error.removeFailed"))
          }
        } catch (error) {
          toast({ status: "error", description: (error as Error).message || tError("generic") })
        }
      })
    }
  }

  return (
    <div className={cn(
      "relative aspect-video h-full w-full group rounded-lg overflow-hidden mb-4",
      !url && "h-[0px]",
      url && "bg-muted bg-no-repeat bg-center bg-cover",
      isPending && "opacity-50"
    )} style={{ backgroundImage: url ? `url(${url})` : "none" }}>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {url && !isPending && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 flex items-center gap-x-2">
          <Button
            onClick={handleOpen}
            className="text-muted-foreground p-2 rounded-full shadow-md"
            variant="outline"
            size="sm"
            disabled={isUpdating && isPending}
          >
            <IoImage className="h-4 w-4" />
          </Button>
          <ConfirmDialog onConfirm={handleRemove} actiontitle={tUi("removeCover")}>
            <Button
              className="text-muted-foreground p-2 rounded-full shadow-md"
              variant="outline"
              size="sm"
              disabled={isUpdating && isPending}
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