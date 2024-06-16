"use client"


import { useState, useTransition, useRef } from "react"
import { useEventListener } from "usehooks-ts"
import { ListWithCards, BoardRole } from "@/lib/models/types"
import { updateList } from "@/lib/actions/list/update-list"

import { useToast } from "@/components/ui/use-toast"
import { FormInput } from "@/components/shared/form/form-input"
import { ListOptions } from "./list-options"

interface ListHeaderProps {
  listData: ListWithCards
  onAddCard: () => void,
  role: BoardRole
}

export const ListHeader = ({
  listData,
  onAddCard,
  role
}: ListHeaderProps) => {
  const { toast } = useToast()

  const [title, setTitle] = useState(listData.title)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const enableEditing = () => {
    if (role === BoardRole.VIEWER) return

    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const handleSubmit = (formData: FormData) => {
    if (role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Editing is restricted to authorized users only." })
      return
    }
    
    const title = formData.get("title") as string
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    if (title === listData.title) {
      return disableEditing()
    }

    startTransition(() => {
      updateList({ title, id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Itinerary "${res?.data.title}" updated` })
            setTitle(res.data.title)
            disableEditing()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const onBlur = () => {
    formRef.current?.requestSubmit()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit()
    }
  }

  useEventListener("keydown", onKeyDown)

  if (role === BoardRole.VIEWER) {
    return (
      <div className="pt-2 px-2 mb-4 text-sm font-semibold flex justify-between items-start gap-x-2">
        <div className="text-teal-900">
          {title}
        </div>
      </div>
    )
  }
  
  return (
    <div className="pt-2 px-2 mb-4 text-sm font-semibold flex justify-between items-start- gap-x-2">
      {isEditing ? (
        <form 
          ref={formRef}
          action={handleSubmit}  
          className="flex-1 px-[2px]"
        >
          <input hidden id="id" name="id" defaultValue={listData._id} />
          <input hidden id="boardId" name="boardId" defaultValue={listData.boardId.toString()} />
          <FormInput
            disabled={isPending}
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title.."
            defaultValue={title}
            className="text-sm text-teal-900 px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm text-teal-900 px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions
        onAddCard={onAddCard}
        listData={listData}
        role={role}
      />
    </div>
  )
}