"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { CardWithList } from '@/lib/models/types'
import { copyCard } from "@/lib/actions/card/copy-card"
import { deleteCard } from "@/lib/actions/card/delete-card"
import { useCardModal } from "@/hooks/use-card-modal"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MdDelete } from "react-icons/md"
import { FaRegCopy } from "react-icons/fa"

interface ActionsProps {
  data: CardWithList
}

export const Options = ({
  data,
}: ActionsProps) => {
  const params = useParams()
  const cardModal = useCardModal()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const onCopy = () => {
    const boardId = params.boardId as string

    startTransition(() => {
      copyCard({ id: data._id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Attraction "${res?.data.title}" copied` })
            cardModal.onClose()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const onDelete = () => {
    const boardId = params.boardId as string

    startTransition(() => {
      deleteCard({ id: data._id, boardId})
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Attraction "${res?.data.title}" deleted` })
            cardModal.onClose()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }
  
  return (
    <div className="space-y-3 mt-2">
      <div className="mb-3" />
      <Button
        onClick={onCopy}
        disabled={isPending}
        className="w-full justify-start"
        size="inline"
        variant="secondary"
      >
        <FaRegCopy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isPending}
        className="w-full justify-start"
        size="inline"
        variant="destructive"
      >
        <MdDelete className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

Options.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-3 mt-8">
      <Skeleton className="w-full h-8 bg-gray-200" />
      <Skeleton className="w-full h-8 bg-gray-200" />
    </div>
  )
}