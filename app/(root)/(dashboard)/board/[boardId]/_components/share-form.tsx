"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IBoard, BoardRole } from "@/lib/models/types"
import { ShareBoardValidation } from "@/lib/validations/board"
import { shareBoard } from "@/lib/actions/board/share-board"
import { unshareBoard } from "@/lib/actions/board/unshare-board"
import { updateShareRole } from "@/lib/actions/board/update-share-role"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { FiTrash } from "react-icons/fi"
import { AiOutlineLink } from "react-icons/ai"

interface SharedUsersProps {
  sharedUsers: { email: string; role: BoardRole }[]
  handleRoleChange: (email: string, newRole: BoardRole) => void
  handleUnshare: (email: string) => void
  isPending: boolean
}

const SharedUsers = ({
  sharedUsers,
  handleRoleChange,
  handleUnshare,
  isPending,
}: SharedUsersProps ) => {
  return (
    <div className="mt-6 text-sm">
      <h3 className="text-lg font-semibold">People with access</h3>
      {sharedUsers.map((user) => (
        <div
          key={user.email}
          className="flex justify-between items-center py-2 space-x-2"
        >
          <span>{user.email}</span>
          <Select
            onValueChange={(value) =>
              handleRoleChange(user.email, value as BoardRole)
            }
            value={user.role}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
              <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            onClick={() => handleUnshare(user.email)}
            disabled={isPending}
            className="px-2"
          >
            <FiTrash className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

interface ShareFormProps {
  boardData: IBoard
}

export const ShareForm = ({ boardData }: ShareFormProps) => {
  const initialSharedUsers = [
    ...boardData.viewers.map(email => ({ email, role: BoardRole.VIEWER })),
    ...boardData.editors.map(email => ({ email, role: BoardRole.EDITOR }))
  ]

  const [sharedUsers, setSharedUsers] = useState(initialSharedUsers)
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ShareBoardValidation>>({
    resolver: zodResolver(ShareBoardValidation),
    defaultValues: {
      boardId: boardData._id,
      email: "",
      role: BoardRole.VIEWER
    }
  })

  const copyLink = () => {
    const link = `${window.location.origin}/board/${boardData._id}`
    navigator.clipboard.writeText(link)
      .then(() => setSuccess("Link copied to clipboard"))
      .catch(() => setError("Failed to copy link"))
  }

  const isError = (data: { success?: string; error?: string }): data is { error: string } => {
    return "error" in data
  }

  async function onSubmit(values: z.infer<typeof ShareBoardValidation>) {
    // console.log(values)
    setError("")
    setSuccess("")
    
    startTransition(() => {
      shareBoard(values)
        .then((data) => {
          if (isError(data)) {
            setError(data.error)
          } else {
            setSuccess(data.success)
          }
        })
        .catch(() => setError("Something went wrong"))
    })
  }

  async function handleRoleChange(email: string, newRole: BoardRole) {
    setError("")
    setSuccess("")

    startTransition(() => {
      updateShareRole({
        boardId: boardData._id,
        email,
        role: newRole as BoardRole.VIEWER | BoardRole.EDITOR
      })
        .then((data) => {
          if (isError(data)) {
            setError(data.error)
          } else {
            setSuccess(data.success)
            setSharedUsers(
              sharedUsers.map((user) =>
                user.email === email ? { ...user, role: newRole } : user
              )
            )
          }
        })
        .catch(() => setError("Something went wrong"))
    })
  }

  async function handleUnshare(email: string) {
    setError("")
    setSuccess("")

    startTransition(() => {
      unshareBoard({ boardId: boardData._id, email })
        .then((data) => {
          if (isError(data)) {
            setError(data.error)
          } else {
            setSuccess(data.success)
            setSharedUsers(sharedUsers.filter(user => user.email !== email))
          }
        })
        .catch(() => setError("Something went wrong"))
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="mail@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BoardRole.VIEWER}>Viewer</SelectItem>
                        <SelectItem value={BoardRole.EDITOR}>Editor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="mt-6 flex gap-2">
            <Button
              variant="primary"
              className="w-full"
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
            >
              Share
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={copyLink}
            >
              <AiOutlineLink className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </form>
      </Form>
      {sharedUsers.length > 0 && (
        <SharedUsers
          sharedUsers={sharedUsers}
          handleRoleChange={handleRoleChange}
          handleUnshare={handleUnshare}
          isPending={isPending}
        />
      )}
    </>
  )
}