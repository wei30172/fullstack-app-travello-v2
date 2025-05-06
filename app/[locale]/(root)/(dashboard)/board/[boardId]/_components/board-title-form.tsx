"use client"

import { useState, useTransition, useEffect, useRef  } from "react"
import { useTranslations } from "next-intl"
import { IBoard, BoardRole } from "@/lib/database/models/types"
import { updateBoard } from "@/lib/actions/board/update-board"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FormInput } from "@/components/shared/form/form-input"

interface BoardTitleFormProps {
  boardData: IBoard
}

export const BoardTitleForm = ({ boardData }: BoardTitleFormProps) => {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(boardData.title)
  const [isEditing, setIsEditing] = useState(false)

  const tToast = useTranslations("BoardForm.toast")
  const tError = useTranslations("Common.error")
  
  useEffect(() => {
    setTitle(boardData.title)
  }, [boardData.title])

  const enableEditing = () => {
    if (boardData.role === BoardRole.VIEWER) return

    setIsEditing(true)
    setTimeout(() => {
     inputRef.current?.focus()
     inputRef.current?.select() 
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onSubmit = (formData: FormData) => {
    if (boardData.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }

    const title = formData.get("title") as string
    
    if (title === boardData.title) {
      return disableEditing()
    }

    startTransition(() => {
      updateBoard({
        title,
        boardId: boardData._id
      })
      .then((res) => {
        if (res?.data) {
          toast({
            status: "success",
            title: tToast("success.updated", { title: res?.data.title })
          })
          setTitle(res.data.title)
          disableEditing()
        } else if (res?.error) {
          toast({ status: "error", description: res?.error })
        }
      })
      .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const onBlur = () => {
    formRef.current?.requestSubmit()
  }

  if (boardData.role === BoardRole.VIEWER) {
    return (
      <div className="font-bold text-lg h-auto w-auto p-1 px-2">
        {title}
      </div>
    )
  }
  
  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
        <FormInput
          disabled={isPending}
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    )
  }
  
  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      disabled={isPending}
    >
      {title}
    </Button>
  )
}
