"use client"

import { useState, useTransition, useEffect, useRef, ElementRef  } from "react"
import { IBoard } from "@/lib/models/types"
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

  const formRef = useRef<ElementRef<"form">>(null)
  const inputRef = useRef<ElementRef<"input">>(null)

  const [title, setTitle] = useState(boardData.title)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setTitle(boardData.title)
  }, [boardData.title])

  const enableEditing = () => {
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
    const title = formData.get("title") as string
    
    if (title === boardData.title) {
      return disableEditing()
    }

    startTransition(() => {
      updateBoard({
        title,
        id: boardData._id
      })
      .then((res) => {
        if (res?.data) {
          toast({ status: "success", title: `Trip "${res.data.title}" updated` })
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
