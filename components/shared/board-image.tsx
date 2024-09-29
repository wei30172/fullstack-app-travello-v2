"use client"

import { useCoverModal } from "@/hooks/use-cover-modal"
import { cn } from "@/lib/utils"

import { IoImage, IoTrashBin } from "react-icons/io5"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Spinner } from "@/components/shared/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface BoardImageProps {
  url?: string
  onClose: () => void
  handleRemove: () => void
  isUpdating: boolean
}

const BoardImage = ({
  url,
  onClose,
  handleRemove,
  isUpdating
}: BoardImageProps) => {
  const coverImage =  useCoverModal()

  const handleOpen = () => {
    coverImage.onOpen()
    onClose()
  }

  return (
    <div className={cn(
      "relative aspect-video h-full w-full group rounded-lg overflow-hidden mb-4",
      !url && "h-[0px]",
      url && "bg-muted bg-no-repeat bg-center bg-cover",
      isUpdating && "opacity-50"
    )} style={{ backgroundImage: url ? `url(${url})` : "none" }}>
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {url && !isUpdating && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 flex items-center gap-x-2">
          <Button
            onClick={handleOpen}
            className="text-muted-foreground p-2 rounded-full shadow-md"
            variant="outline"
            size="sm"
            disabled={isUpdating}
          >
            <IoImage className="h-4 w-4" />
          </Button>
          <ConfirmDialog onConfirm={handleRemove} actiontitle="Remove Cover">
            <Button
              className="text-muted-foreground p-2 rounded-full shadow-md"
              variant="outline"
              size="sm"
              disabled={isUpdating}
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