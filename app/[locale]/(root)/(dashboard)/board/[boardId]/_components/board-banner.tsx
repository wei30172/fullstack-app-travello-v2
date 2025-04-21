"use client"

import { useTransition  } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { updateBoard } from "@/lib/actions/board/update-board"
import { deleteBoard } from "@/lib/actions/board/delete-board"

import { Spinner } from "@/components/shared/spinner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface BoardBannerProps {
  boardId: string
}
export const BoardBanner = ( { boardId }: BoardBannerProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("BoardForm.ui")
  const tToast = useTranslations("BoardForm.toast")
  const tError = useTranslations("Common.error")
  
  const handleRestore = () => {
    startTransition(() => {
      updateBoard({
        isArchived: false,
        boardId
      })
      .then((res) => {
        if (res?.data) {
          toast({
            status: "success",
            title: tToast("success.restored", { title: res?.data.title })
          })
        } else if (res?.error) {
          toast({
            status: "error",
            description: res?.error
          })
        }
      })
      .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const handleRemove = () => {
    startTransition(() => {
      deleteBoard({ boardId })
        .then((res) => {
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.deleted", { title: res?.data.title })
            })
            router.push("/boards")
          }
          if (res?.error) {
            toast({
              status: "error",
              description: tToast("error.deleteFailed")
            })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }
  return (
    <div className="h-12 bg-rose-500 p-2 text-center text-sm text-white flex items-center gap-x-2 justify-center">
      <p>
        {tUi("tripInTrash")}
      </p>
      <Button
        size="sm"
        onClick={handleRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white p-1 px-2 h-auto font-normal"
      >
        {tUi("restore")}
      </Button>
      <ConfirmDialog onConfirm={handleRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white p-1 px-2 h-auto font-normal"
        >
          {tUi("deleteForever")}
        </Button>
      </ConfirmDialog>
      {isPending && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  )
}