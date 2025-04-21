"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { unshareSelf } from "@/lib/actions/board/unshare-self-board"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"

interface UnshareSelfProps {
  boardId: string
}

export const UnshareSelf = ({
  boardId,
}: UnshareSelfProps ) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("BoardForm.ui")
  const tToast = useTranslations("BoardForm.toast")
  const tError = useTranslations("Common.error")
  
  const onClick = () => {
    startTransition(() => {
      unshareSelf({ boardId })
        .then((res) => {
          if (res?.data) {
            toast({
              status: "success",
              description: tToast("success.selfUnshared")
            })
            router.push("/boards")
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  return (
    <ConfirmDialog onConfirm={onClick} actiontitle={tUi("leave")}>
      <Button
        variant="secondary"
        className="w-full"
        disabled={isPending}>
        {tUi("leaveTrip")}
      </Button>
    </ConfirmDialog>
  )
}