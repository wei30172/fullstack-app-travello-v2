"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
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

  const tUi = useTranslations("CardForm.ui")
  const tToast = useTranslations("CardForm.toast")
  const tError = useTranslations("Common.error")
  
  const handleSwitchChange = () => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
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
              title: tToast("success.attractionUpdated", { title: res?.data.title })
            })
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const onCopy = () => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }

    const boardId = params.boardId as string

    startTransition(() => {
      copyCard({ id: data._id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.attractionCopied", { title: res?.data.title })
            })
            cardModal.onClose()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const onDelete = () => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }

    const boardId = params.boardId as string

    startTransition(() => {
      deleteCard({ id: data._id, boardId})
        .then((res) => {
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.attractionDeleted", { title: res?.data.title })
            })
            cardModal.onClose()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }
  
  return (
    <div className="mt-1">
      <div className="mx-2">
        <div className="flex items-center justify-between">
          <label htmlFor="isCompleted" className="font-medium text-sm text-gray-700 cursor-pointer">
            {tUi("attractionDone")}
          </label>
          <Switch
            id="isCompleted"
            disabled={isPending}
            checked={completed}
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <Button
          onClick={onCopy}
          variant="secondary"
          size="inline"
          className="w-full mt-6 mb-2"
          disabled={isPending}>
          {tUi("attractionCopy")}
        </Button>
        <ConfirmDialog onConfirm={onDelete}>
          <Button
            variant="destructive"
            size="inline"
            className="w-full"
            disabled={isPending}>
            {tUi("attractionDelete")}
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}