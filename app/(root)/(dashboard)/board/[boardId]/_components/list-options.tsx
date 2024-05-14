"use client"

import { useTransition, useRef, ElementRef } from "react"
import { ListWithCards } from "@/lib/models/types"
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
import { FiMoreHorizontal, FiPlus } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"
import { FaRegCopy } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

interface ListOptionsProps {
  listData: ListWithCards
  onAddCard: () => void
}

export const ListOptions = ({
  listData,
  onAddCard,
}: ListOptionsProps) => {
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const closeRef = useRef<ElementRef<"button">>(null)

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    startTransition(() => {
      deleteList({ id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Itinerary "${res?.data.title}" deleted` })
            closeRef.current?.click()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    startTransition(() => {
      copyList({ id, boardId })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Itinerary "${res?.data.title}" added` })
            closeRef.current?.click()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <FiMoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-teal-900 pb-4">
          Itinerary actions
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
          Add attractions...
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
            Copy Itinerary...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={listData._id} />
          <input hidden name="boardId" id="boardId" defaultValue={listData.boardId.toString()} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            disabled={isPending}
          >
            <MdDelete className="h-4 w-4 mr-2" />
            Delete this Itinerary
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}