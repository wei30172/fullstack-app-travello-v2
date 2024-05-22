"use client"

import {
  useState,
  useRef,
  forwardRef,
  useTransition,
  ElementRef, 
  KeyboardEventHandler,
} from "react"
import { useParams } from "next/navigation"
import { useOnClickOutside, useEventListener } from "usehooks-ts"
import { createCard } from "@/lib/actions/card/create-card"
import { FormErrors } from "@/lib/validations/types"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FormSubmit } from "@/components/shared/form/form-submit"
import { FormTextarea } from "@/components/shared/form/form-textarea"
import { FiPlus } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"

interface CardFormProps {
  listId: string
  enableEditing: () => void
  disableEditing: () => void
  isEditing: boolean
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
  listId,
  enableEditing,
  disableEditing,
  isEditing,
}, ref) => {
  const params = useParams()
  const { toast } = useToast()

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  const formRef = useRef<ElementRef<"form">>(null)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing()
    }
  }

  useOnClickOutside(formRef, disableEditing)
  useEventListener("keydown", onKeyDown)

  const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string
    const listId = formData.get("listId") as string
    const boardId = params.boardId as string

    startTransition(() => {
      createCard({ title, listId, boardId })
        .then((res) => {
          setFieldErrors({})
          if (res?.data) {
            toast({ status: "success", title: `Attractions "${res?.data.title}" created` })
            formRef.current?.reset()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
          if (res?.errors) {
            setFieldErrors(res?.errors)
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className="m-1 py-0.5 px-1 space-y-4"
      >
        <FormTextarea
          id="title"
          onKeyDown={onTextareakeyDown}
          ref={ref}
          placeholder="Enter a title for this attractions..."
          errors={fieldErrors}
          className="text-teal-900"
        />
        <input
          hidden
          id="listId"
          name="listId"
          defaultValue={listId}
        />
        <div className="flex items-center gap-x-1">
          <FormSubmit>
            Add attraction
          </FormSubmit>
          <Button
            size="sm"
            onClick={disableEditing}
            variant="ghost"
            disabled={isPending}
          >
            <IoMdClose className="h-5 w-5" />
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="pt-2 px-2">
      <Button
        onClick={enableEditing}
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        size="sm"
        variant="ghost"
      >
        <FiPlus className="h-4 w-4 mr-2" />
        Add a attraction
      </Button>
    </div>
  )
})

CardForm.displayName = "CardForm"