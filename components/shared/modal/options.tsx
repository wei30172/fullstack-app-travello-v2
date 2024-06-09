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
import { DeleteAlertDialog } from "@/components/shared/delete-alert-dialog"

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
    <div className="mt-3">
      <div className="md:mb-6"/>
      <div className="mx-2 space-y-3">
        <Button
          onClick={onCopy}
          disabled={isPending}
          className="w-full"
          size="inline"
          variant="secondary">
          Copy
        </Button>
        <DeleteAlertDialog
          title="Delete"
          onConfirm={onDelete}
          isPending={isPending}
        />
      </div>
    </div>
  )
}