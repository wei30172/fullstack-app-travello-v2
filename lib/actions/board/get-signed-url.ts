"use server"

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import s3Client from "@/lib/s3client"
import { currentUser } from "@/lib/session"
import { formatFileSize, generateFileName } from "@/lib/utils"
import { getBoard } from "./get-board"
import { addMedia } from "./add-media"
import { removeMedia } from "./remove-media"
import { updateBoard } from "./update-board"

type SignedURLResponse = 
  | { error?: undefined; success: { url: string } }
  | { error: string; success?: undefined }


const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  // "video/mp4",
  // "video/quicktime"
]

const maxFileSize = 1024 * 1024 * 1.2 // 1.2 MB

type GetSignedURLParams = {
  fileType: string
  fileSize: number
  checksum: string
  boardId: string
}

export async function getSignedURL({
  fileType,
  fileSize,
  checksum,
  boardId
}: GetSignedURLParams): Promise<SignedURLResponse> {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  if (!allowedFileTypes.includes(fileType)) {
    return { error: "File type not allowed" }
  }

  if (fileSize > maxFileSize) {
    return { error: `File size too large. Maximum allowed size is ${formatFileSize(maxFileSize)}.` }
  }

  const userId = user._id.toString()
  const board = await getBoard(boardId)

  if (!board) {
    return { error: "Trip not found" }
  }

  const oldImageUrl = board.imageUrl?.trim()

  const newFileName = generateFileName()
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: newFileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: { userId }
  })

  try {
    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // 60s
    )

    console.log("Generated Signed URL:", url)

    const mediaType = fileType.startsWith("image") ? "image" : "video"
    const mediaUrl = url.split("?")[0]

    const boardRes = await updateBoard({ imageUrl: mediaUrl, boardId }) 

    if (boardRes?.error) {
      return { error: boardRes.error }
    }

    const mediaRes = await addMedia({
      userId,
      type: mediaType,
      url: mediaUrl
    })

    if (mediaRes?.error) {
      return { error: mediaRes.error }
    }
    
    if (oldImageUrl) {
      const deleteRes = await removeMedia(oldImageUrl)
      if (deleteRes?.error) {
        return { error: deleteRes.error }
      }
    }
    
    return { success: { url } }
  } catch (error) {
    console.error("Error generating signed URL", error)
    return { error: "Failed to generate signed URL" }
  }
}