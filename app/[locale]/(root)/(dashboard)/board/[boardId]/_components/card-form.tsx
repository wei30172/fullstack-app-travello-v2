"use client"

import {
  useState,
  useRef,
  forwardRef,
  useTransition,
  KeyboardEventHandler,
} from "react"
import { useParams } from "next/navigation"
import { useOnClickOutside, useEventListener } from "usehooks-ts"
import { useTranslations } from "next-intl"
import { BoardRole } from "@/lib/database/models/types"
import { FormErrors } from "@/lib/validations/types"
import { createCard } from "@/lib/actions/card/create-card"

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
  isEditing: boolean,
  role: BoardRole
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
  listId,
  enableEditing,
  disableEditing,
  isEditing,
  role
}, ref) => {
  const params = useParams()
  const { toast } = useToast()

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("CardForm.ui")
  const tToast = useTranslations("CardForm.toast")
  const tError = useTranslations("Common.error")
  
  const formRef = useRef<HTMLFormElement>(null)

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
    if (role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }
    
    const title = formData.get("title") as string
    const listId = formData.get("listId") as string
    const boardId = params.boardId as string

    startTransition(() => {
      createCard({ title, listId, boardId })
        .then((res) => {
          setFieldErrors({})
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.attractionCreated", { title: res?.data.title })
            })
            formRef.current?.reset()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
          if (res?.errors) {
            setFieldErrors(res?.errors)
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
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
          placeholder={tUi("attractionPlaceholder")}
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
            {tUi("addAttraction")}
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
        {tUi("addAttractionButton")}
      </Button>
    </div>
  )
})

CardForm.displayName = "CardForm"