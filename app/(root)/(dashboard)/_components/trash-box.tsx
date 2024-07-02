"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IBoard } from "@/lib/models/types"
import { getArchivedBoards } from "@/lib/actions/board/get-archived-boards"
import { updateBoard } from "@/lib/actions/board/update-board"
import { deleteBoard } from "@/lib/actions/board/delete-board"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/shared/spinner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { FaSearch, FaTrash, FaUndo } from "react-icons/fa"


export const TrashBox = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  
  const queryClient = useQueryClient()
  const { data: archivedBoards, isLoading, isError } = useQuery<IBoard[]>({
    queryKey: ["archivedBoards"],
    queryFn: () => getArchivedBoards()
  })

  const filteredBoards = archivedBoards?.filter((board) => {
    return board.title.toLowerCase().includes(search.toLowerCase());
  })

  const handleTitleClick = (boardId: string) => router.push(`/board/${boardId}`)

  const handleRestore = (boardId: string) => {
    startTransition(() => {
      updateBoard({
        isArchived: false,
        boardId
      })
      .then((res) => {
        if (res?.data) {
          toast({ status: "success", title: `Trip "${res?.data.title}" restored!` })
          queryClient.invalidateQueries({ queryKey: ["archivedBoards"] })
        } else if (res?.error) {
          toast({ status: "error", description: res?.error })
        }
      })
      .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const handleRemove = (boardId: string) => {
    startTransition(() => {
      deleteBoard({ boardId })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Trip "${res?.data.title}" deleted!` })
            queryClient.invalidateQueries({ queryKey: ["archivedBoards"] })
          }
          if (res?.error) {
            toast({ status: "error", description: "Failed to delete trip." })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  if (isError) {
    return (
      <div className="p-2 pt-0">
        <span className="text-xs">
          Error loading archived trips.
        </span>
      </div>
    )
  }

  if (isLoading || archivedBoards == null) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <FaSearch className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by board title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        {filteredBoards?.length === 0 ? (
          <p className="text-xs text-center text-muted-foreground pb-2">
            No Trip found.
          </p>
        ) : (filteredBoards?.map((board) => (
          <div
            key={board._id}
            className="text-sm flex items-center text-primary justify-between"
          >
            <span
              role="button"
              onClick={() => handleTitleClick(board._id)}
              className="truncate rounded-sm w-full p-2 hover:bg-primary/5"
            >
              {board.title}
            </span>
            <div className="flex items-center">
              <div
                onClick={() => handleRestore(board._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <FaUndo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmDialog onConfirm={() => handleRemove(board._id)}>
                <div className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  <FaTrash className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </div>
              </ConfirmDialog>
            </div>
          </div>
        )))}
      </div>
      {isPending && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  )
}