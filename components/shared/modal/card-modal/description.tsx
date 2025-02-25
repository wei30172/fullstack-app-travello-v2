"use client"

import { useState, useTransition, useRef } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { CardWithList, BoardRole } from "@/lib/models/types"
import { updateCard } from "@/lib/actions/card/update-card"
import { FormErrors } from "@/lib/validations/types"

import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { FormTextarea } from "@/components/shared/form/form-textarea"
import { FormSubmit } from "@/components/shared/form/form-submit"
import { Button } from "@/components/ui/button"
import { LuMapPin } from "react-icons/lu"

interface DescriptionProps {
  data: CardWithList
  tempDescription: string
  setTempDescription: (description: string) => void
}

export const Description = ({
  data,
  tempDescription,
  setTempDescription
}: DescriptionProps) => {
  const isEditorOrOwner = data.role === BoardRole.EDITOR || data.role === BoardRole.OWNER

  const { toast } = useToast()
  const params = useParams()
  const queryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const enableEditing = () => {
    if (data.role === BoardRole.VIEWER) return

    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
    setTempDescription(data.description || "")
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing()
    }
  }

  useEventListener("keydown", onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const onSubmit = (formData: FormData) => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: "Editing is restricted to authorized users only." })
      return
    }
    
    const description = formData.get("description") as string
    const boardId = params.boardId as string

    startTransition(() => {
      updateCard({ description, boardId, id: data._id })
        .then((res) => {
          setFieldErrors({})
          if (res?.data) {
            queryClient.invalidateQueries({
              queryKey: ["card", res?.data._id]
            }),
            toast({
              status: "success",
              title: `Attraction "${res?.data.title}" updated`
            }),
            disableEditing()
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

  return (
    <div className="flex items-start gap-x-4 w-full">
      <LuMapPin className="h-5 w-5 mt-0.5 text-gray-700" />
      <div className="w-full">
        <p className="font-semibold text-gray-700 mb-6">
          Description{data.role !== BoardRole.VIEWER && "(Click to edit)"}
        </p>
        {isEditorOrOwner ? (
          isEditing ? (
            <form
              action={onSubmit}
              ref={formRef}
              className="space-y-2"
            >
              <FormTextarea
                id="description"
                value={tempDescription}
                className="w-full mt-2 min-h-[80px]"
                placeholder="Add more detailed description"
                onChange={(e) => setTempDescription(e.target.value)}
                errors={fieldErrors}
                ref={textareaRef}
              />
              <div className="flex items-center gap-x-2">
                <FormSubmit>
                  Save
                </FormSubmit>
                <Button
                  type="button"
                  onClick={disableEditing}
                  size="sm"
                  variant="ghost"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div
              onClick={enableEditing}
              role="button"
              className="max-w-[285px] md:max-w-[345px] min-h-[80px] max-h-[200px] overflow-auto text-sm font-medium py-3 px-3.5 break-words
                border-transparent border border-gray-700 rounded-md cursor-pointer"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {tempDescription || "Add more detailed description..."}
            </div>
          )
        ) : (
          <div className="w-full min-h-[80px] text-sm font-medium py-3 px-3.5 break-words
              border-transparent border border-gray-700 rounded-md"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {data.description || "No detailed description provided."}
          </div>
        )}
      </div>
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-4 w-full">
      <Skeleton className="h-5 w-5 bg-gray-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-4 bg-gray-200" />
        <Skeleton className="w-full h-[78px] bg-gray-200" />
      </div>
    </div>
  )
}