"use client"

import { useState, useTransition, useRef } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { CardWithList, BoardRole } from "@/lib/models/types"
import { updateCard } from "@/lib/actions/card/update-card"

import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { FormInput } from "@/components/shared/form/form-input"
import { LuMapPin } from "react-icons/lu"

interface HeaderProps {
  data: CardWithList
}

export const Header = ({
  data,
}: HeaderProps) => {
  const isEditorOrOwner = data.role === BoardRole.EDITOR || data.role === BoardRole.OWNER

  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [title, setTitle] = useState(data?.title)
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const onBlur = () => {
    if (data.role === BoardRole.VIEWER) return
    inputRef.current?.form?.requestSubmit()
  }

  const onSubmit = (formData: FormData) => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Editing is restricted to authorized users only." })
      return
    }
    
    const title = formData.get("title") as string
    const boardId = params.boardId as string
    
    if (title === data.title) {
      return
    }

    startTransition(() => {
      updateCard({ title, boardId, id: data._id })
        .then((res) => {
          if (res?.data) {
            queryClient.invalidateQueries({
              queryKey: ["card", res?.data._id]
            })
            toast({
              status: "success",
              title: `Renamed to "${res?.data.title}"`
            })
            setTitle(res?.data.title)
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  return (
    <div className="flex items-start gap-x-4 mb-2 w-full">
      <LuMapPin className="h-5 w-5 mt-2 text-gray-700" />
      <div className="w-full">
        {isEditorOrOwner ? (
          <form action={onSubmit}>
            <FormInput
              disabled={isPending}
              ref={inputRef}
              onBlur={onBlur}
              id="title"
              defaultValue={title}
              className="font-semibold text-md px-1 text-gray-500 bg-transparent
                border-transparent border border-gray-700 rounded-md
                relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-2 truncate"
            />
          </form>
        ) : (
          <div className="font-semibold text-md text-gray-500 mb-2">
            {title}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          in itinerary <span className="font-semibold">{data.list.title}</span>
        </p>
      </div>
    </div>
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-4 mb-2">
      <Skeleton className="h-5 w-5 bg-gray-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-2 bg-gray-200" />
        <Skeleton className="w-48 h-4 bg-gray-200" />
      </div>
    </div>
  )
}