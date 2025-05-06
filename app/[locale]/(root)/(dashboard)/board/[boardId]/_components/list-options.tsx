"use client"

import { useTransition, useRef } from "react"
import { useTranslations } from "next-intl"
import { ListWithCards, BoardRole } from "@/lib/database/models/types"
import { copyList } from "@/lib/actions/list/copy-list"
import { deleteList } from "@/lib/actions/list/delete-list"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { FormSubmit } from "@/components/shared/form/form-submit"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { FiMoreHorizontal, FiPlus } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"
import { FaRegCopy } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

interface ListOptionsProps {
  listData: ListWithCards
  onAddCard: () => void
  role: BoardRole
}

export const ListOptions = ({
  listData,
  onAddCard,
  role
}: ListOptionsProps) => {
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("ListForm.ui")
  const tToast = useTranslations("ListForm.toast")
  const tError = useTranslations("Common.error")
  
  const closeRef = useRef<HTMLButtonElement>(null)
  const deleteFormRef = useRef<HTMLFormElement>(null)

  const onDelete = (formData: FormData) => {
    if (role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }

    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    startTransition(() => {
      deleteList({ id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.itineraryDeleted", { title: res?.data.title })
            })
            closeRef.current?.click()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const onCopy = (formData: FormData) => {
    if (role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }
    
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    startTransition(() => {
      copyList({ id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({
              status: "success",
              title: tToast("success.itineraryCopied", { title: res?.data.title })
            })
            closeRef.current?.click()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }

  const handleConfirmDelete = () => {
    deleteFormRef.current?.requestSubmit()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <FiMoreHorizontal className="h-4 w-4 text-teal-900" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-teal-900 pb-4">
          {tUi("itineraryActions")}
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900" variant="ghost">
            <IoMdClose className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          {tUi("addAttractions")}
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={listData._id} />
          <input hidden name="boardId" id="boardId" defaultValue={listData.boardId.toString()} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            disabled={isPending}
          >
            <FaRegCopy className="h-4 w-4 mr-2" />
            {tUi("copyItinerary")}
          </FormSubmit>
        </form>
        <Separator className="mt-6"/>
        <form ref={deleteFormRef} action={onDelete}>
          <input hidden name="id" id="id" defaultValue={listData._id} />
          <input hidden name="boardId" id="boardId" defaultValue={listData.boardId.toString()} />
          <ConfirmDialog onConfirm={handleConfirmDelete}>
            <FormSubmit
              type="button"
              variant="ghost"
              className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
              disabled={isPending}
            >
              <MdDelete className="h-4 w-4 mr-2" />
              {tUi("deleteItinerary")}
            </FormSubmit>
          </ConfirmDialog>
        </form>
      </PopoverContent>
    </Popover>
  )
}