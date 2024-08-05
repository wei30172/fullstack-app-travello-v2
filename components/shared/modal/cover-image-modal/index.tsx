"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { getSignedURL } from "@/lib/actions/board/get-signed-url"
import { useCoverModal } from "@/hooks/use-cover-modal"

import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ImageDropzone } from "@/components/shared/image-dropzone"

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
  const { toast } = useToast()

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
    const boardId = params.boardId as string

    if (!file) {
      toast({ status: "warning", description: "Please upload the image first" })
      return
    }

    startTransition(async () => {
      try {
        const checksum = await computeSHA256(file)
        const signedURLResult = await getSignedURL({
          fileType: file.type,
          fileSize: file.size,
          checksum,
          boardId
        })
        
        if (signedURLResult?.success) {
          const response = await fetch(signedURLResult?.success.url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file
          })
          // console.log({response})

          if (response.ok) {
            toast({ status: "success", title: "Image uploaded successfully!" })
            onClose()
          } else {
            toast({ status: "error", title: "Upload failed" })
          }
        } else if (signedURLResult?.error) {
          toast({ status: "error", title: signedURLResult.error })
        }
      } catch (error) {
        console.error("Error during upload process:", error)
        toast({ status: "error", description: "Something went wrong" })
      }
    })
  }
  
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Trip Cover
          </h2>
        </DialogHeader>
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
