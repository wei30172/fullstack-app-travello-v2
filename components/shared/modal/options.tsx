"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { CardWithList, BoardRole } from "@/lib/models/types"
import { updateCard } from "@/lib/actions/card/update-card"
import { copyCard } from "@/lib/actions/card/copy-card"
import { deleteCard } from "@/lib/actions/card/delete-card"
import { useCardModal } from "@/hooks/use-card-modal"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"

interface ActionsProps {
  data: CardWithList
}

export const Options = ({
  data,
}: ActionsProps) => {
  const params = useParams()
  const cardModal = useCardModal()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const [completed, setCompleted] = useState(data.isCompleted || false)

  const onToggleCompleted = () => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Editing is restricted to authorized users only." })
      return
    }

    const boardId = params.boardId as string
    const updatedCompleted = !completed
    setCompleted(updatedCompleted)

    startTransition(() => {
      updateCard({ isCompleted: updatedCompleted, boardId, id: data._id })
        .then((res) => {
          if (res?.data) {
            queryClient.invalidateQueries({
              queryKey: ["card", res?.data._id]
            })
            toast({
              status: "success",
              title: `Attraction "${res?.data.title}" updated`
            })
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const onCopy = () => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Editing is restricted to authorized users only." })
      return
    }

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
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Deleting is restricted to authorized users only." })
      return
    }

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
    <div className="mt-1">
      <div className="mx-2">
        <div className="flex items-center justify-between">
          <label htmlFor="isCompleted" className="font-medium text-sm text-gray-700 cursor-pointer">
            Done
          </label>
          <Switch
            id="isCompleted"
            disabled={isPending}
            checked={completed}
            onCheckedChange={onToggleCompleted}
          />
        </div>
        <Button
          onClick={onCopy}
          variant="secondary"
          size="inline"
          className="w-full mt-6 mb-2"
          disabled={isPending}>
          Copy
        </Button>
        <ConfirmDialog onConfirm={onDelete}>
          <Button
            variant="destructive"
            size="inline"
            className="w-full"
            disabled={isPending}>
            Delete
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}