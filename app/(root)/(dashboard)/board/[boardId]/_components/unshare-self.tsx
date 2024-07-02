"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { unshareSelf } from "@/lib/actions/board/unshare-self-board"

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

  const onClick = () => {
    startTransition(() => {
      unshareSelf({ boardId })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", description: `You have successfully removed yourself as an ${res?.data.role} from the trip.` })
            router.push("/boards")
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  return (
    <ConfirmDialog onConfirm={onClick} actiontitle="Leave">
      <Button
        variant="secondary"
        className="w-full"
        disabled={isPending}>
        Leave Trip
      </Button>
    </ConfirmDialog>
  )
}