"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { MAX_FREE_COVER } from "@/constants/board"
import { CountType, BoardRole, IBoard } from "@/lib/database/models/types"
import { useCurrentUser, useCheckRole } from "@/hooks/use-session"
import { 
  getAvailableBoardCoverCount,
  hasAvailableBoardCoverCount,
  incrementBoardCoverCount
} from "@/lib/actions/user-limit"
import { getBoard } from "@/lib/actions/board/get-board"
import { addMedia } from "@/lib/actions/board/add-media"
import { removeMedia } from "@/lib/actions/board/remove-media"
import { updateBoard } from "@/lib/actions/board/update-board"
import { uploadFileToS3 } from "@/lib/api-handler/board"
import { useCoverModal } from "@/hooks/use-cover-modal"

import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ImageDropzone } from "@/components/shared/image-dropzone"
import { AvailableCount } from "@/components/shared/AI-response/available-count"

const computeSHA256 = async (file: File) => {
  if (!window.crypto || !crypto.subtle) {
    throw new Error("Web Crypto API is not supported in this environment")
  }

  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const CoverImageModal = () => {
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const user = useCurrentUser()
  const checkRole = useCheckRole()
  const [isPending, startTransition] = useTransition()
  const coverImage =  useCoverModal()
  const [file, setFile] = useState<File | undefined>(undefined)

  const tUi = useTranslations("BoardForm.ui")
  const tToast = useTranslations("BoardForm.toast")
  const tError = useTranslations("Common.error")

  const onClose = () => {
    setFile(undefined)
    coverImage.onClose()
  }

  const onChange = (file?: File) => setFile(file)

  const handleUploadToS3 = async (file: File) => {
    const checksum = await computeSHA256(file)
    const params = { fileType: file.type, fileSize: file.size, checksum }
    const res: any = await uploadFileToS3(params)

    if (!res.ok) {
      throw new Error(`Error: ${res.error}`)
    }

    const uploadResponse = await fetch(res.url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    })

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to S3")
    }

    return res.url.split("?")[0]
  }

  const handleSuccessfulUpload = async (userId: string, board: IBoard, mediaUrl: string, mediaType: string) => {
    await updateBoard({ imageUrl: mediaUrl, boardId: board._id.toString() })
    await addMedia({ userId, type: mediaType, url: mediaUrl })
  
    const oldImageUrl = board.imageUrl?.trim()
    if (oldImageUrl) {
      await removeMedia(oldImageUrl)
    }
  
    if (!checkRole) {
      await incrementBoardCoverCount()
      queryClient.invalidateQueries({
        queryKey: [CountType.BOARD_COVER_COUNT]
      })
    }
  
    toast({ status: "success", title: tToast("success.coverUploaded") })
    onClose()
  }
  
  const onSubmit = async () => {
    if (!user) {
      toast({ status: "error", title: "Unauthorized!" })
      return
    }

    if (!file) {
      toast({ status: "warning", description: tToast("warning.coverUploadRequired") })
      return
    }

    const canUse = await hasAvailableBoardCoverCount()

    if (!canUse && !checkRole) {
      toast({
        status: "warning", description: tToast("warning.coverLimitReached") })
      return
    }

    const boardId = params.boardId as string

    startTransition(async () => {
      try {
        const board = await getBoard(boardId)

        if (!board) {
          toast({ status: "error", title: tError("boardNotFound") })
          return
        }
        
        if (board.role === BoardRole.VIEWER) {
          toast({ status: "warning", description: tError("unauthorized") })
          return
        }

        const mediaUrl = await handleUploadToS3(file)
        const mediaType = file.type.startsWith("image") ? "image" : "video"
        await handleSuccessfulUpload(user._id.toString(), board, mediaUrl, mediaType)
      } catch (error) {
        console.error("Error during upload process:", error)
        toast({ status: "error", description: (error as Error).message || tError("generic") })
      }
    })
  }
  
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            {tUi("coverTitle")}
          </h2>
        </DialogHeader>
        <AvailableCount
          queryKey={CountType.BOARD_COVER_COUNT}
          queryFn={getAvailableBoardCoverCount}
          maxCount={MAX_FREE_COVER}
          label={tUi("coverUploadLabel", { remaining: "{remaining}" })}
          description={tUi("coverUploadDescription", { max: MAX_FREE_COVER })}
        />
        <ImageDropzone
          className="w-full outline-none"
          onChange={onChange}
          onSubmit={onSubmit}
          value={file}
          disabled={isPending}
        />
      </DialogContent>
    </Dialog>
  )
}