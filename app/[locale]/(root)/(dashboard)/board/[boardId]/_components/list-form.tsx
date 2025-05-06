"use client"

import { useState, useTransition, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { useTranslations } from "next-intl"
import { BoardRole } from "@/lib/database/models/types"
import { FormErrors } from "@/lib/validations/types"
import { createList } from "@/lib/actions/list/create-list"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FormInput } from "@/components/shared/form/form-input"
import { FormSubmit } from "@/components/shared/form/form-submit"
import { ListWrapper } from "./list-wrapper"
import { FiPlus } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"

interface ListFormProps {
  role: BoardRole
}

export const ListForm = ({
  role
}: ListFormProps) => {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const tUi = useTranslations("ListForm.ui")
  const tToast = useTranslations("ListForm.toast")
  const tError = useTranslations("Common.error")
  
  const enableEditing = () => {
    if (role === BoardRole.VIEWER) return

    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing()
    }
  }

  useEventListener("keydown", onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const onSubmit = (formData: FormData) => {
    if (role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }
    
    const title = formData.get("title") as string
    const boardId = formData.get("boardId") as string

    startTransition(() => {
      createList({ title, boardId })
        .then((res) => {
          setFieldErrors({})
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.itineraryCreated", { title: res?.data.title })
            })
            disableEditing()
            router.refresh()
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
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-sm bg-white space-y-4 shadow-md"
        >
          <FormInput
            disabled={isPending}
            ref={inputRef}
            errors={fieldErrors}
            id="title"
            className="text-sm text-teal-900 px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder={tUi("addItineraryPlaceholder")}
          />
          <input
            hidden
            defaultValue={params.boardId}
            name="boardId"
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit>
              {tUi("addItinerary")}
            </FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              disabled={isPending}
            >
              <IoMdClose className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    )
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-sm bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <FiPlus className="h-4 w-4 mr-2" />
        {tUi("addItinerary")}
      </button>
    </ListWrapper>
  )
}