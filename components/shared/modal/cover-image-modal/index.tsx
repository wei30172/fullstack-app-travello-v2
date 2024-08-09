"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { MAX_FREE_COVER } from "@/constants/board"
import { 
  getAvailableBoardCoverCount,
  hasAvailableBoardCoverCount,
  incrementBoardCoverCount
} from "@/lib/actions/user-limit"
import { CountType, IBoard } from "@/lib/models/types"
import { useCurrentUser, useCheckRole } from "@/hooks/use-session"
import { getSignedURL } from "@/lib/actions/board/get-signed-url"
import { getBoard } from "@/lib/actions/board/get-board"
import { addMedia } from "@/lib/actions/board/add-media"
import { removeMedia } from "@/lib/actions/board/remove-media"
import { updateBoard } from "@/lib/actions/board/update-board"
import { useCoverModal } from "@/hooks/use-cover-modal"

import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ImageDropzone } from "@/components/shared/image-dropzone"
import { AvailableCount } from "@/components/shared/available-count"

const computeSHA256 = async (file: File) => {
  if (!window.crypto || !crypto.subtle) {
    throw new Error("Web Crypto API is not supported in this environment")
  }

  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return hashHex
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

  const onClose = () => {
    setFile(undefined)
    coverImage.onClose()
  }

  const onChange = (file?: File) => {
    setFile(file)
  }

  const onSubmit = async () => {
    if (!user) {
      toast({ status: "error", title: "Unauthorized!" })
      return
    }

    if (!file) {
      toast({ status: "warning", description: "Please upload the image first" })
      return
    }

    const canUse = await hasAvailableBoardCoverCount()

    if (!canUse && !checkRole) {
      toast({
        status: "warning",
        description: "You have reached your limit of free board cover uploads."
      })
      return
    }

    const boardId = params.boardId as string
    const userId = user._id.toString()

    startTransition(async () => {
      try {
        const board = await getBoard(boardId)

        if (!board) {
          toast({ status: "error", title: "Trip not found!" })
          return
        }
        
        const uploadResult = await uploadFileToS3(file)
        
        if (uploadResult.success) {
          const uploadResponse = await fetch(uploadResult.success.url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file
          })
          // console.log({response})

          if (uploadResponse.ok) {
            const mediaUrl = uploadResult.success.url.split("?")[0]
            const mediaType = file.type.startsWith("image") ? "image" : "video"
            await handleSuccessfulUpload(userId, board, mediaUrl, mediaType)
          }
        } else if (uploadResult.error) {
          toast({ status: "error", title: uploadResult.error })
        }
      } catch (error) {
        console.error("Error during upload process:", error)
        toast({ status: "error", description: "Something went wrong" })
      }
    })
  }
  
  const uploadFileToS3 = async (file: File) => {
    try {
      const checksum = await computeSHA256(file)
      return await getSignedURL({
        fileType: file.type,
        fileSize: file.size,
        checksum
      })
    } catch (error) {
      console.error("Error during S3 upload:", error)
      return { error: "Failed to upload file to S3" }
    }
  }

  const handleSuccessfulUpload = async (userId: string, board: IBoard, mediaUrl: string, mediaType: string) => {
    try {
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
  
      toast({ status: "success", title: "Image uploaded successfully!" })
      onClose()
    } catch (error) {
      console.error("Error handling successful upload:", error)
      toast({ status: "error", description: "Failed to finalize the upload" })
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Trip Cover
          </h2>
        </DialogHeader>
        <AvailableCount
          queryKey={CountType.BOARD_COVER_COUNT}
          queryFn={getAvailableBoardCoverCount}
          maxCount={MAX_FREE_COVER}
          label="{remaining} cover uploads remaining"
          description={`You have ${MAX_FREE_COVER} free board cover uploads available in Free Workspaces.`}
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
