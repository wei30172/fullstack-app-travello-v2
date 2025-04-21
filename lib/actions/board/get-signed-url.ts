"use server"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getTranslations } from "next-intl/server"

import s3Client from "@/lib/s3client"
import { currentUser } from "@/lib/session"
import { formatFileSize, generateFileName } from "@/lib/file"

type SignedURLResponse = 
  | { error?: undefined; success: { url: string } }
  | { error: string; success?: undefined }


const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  // "video/mp4",
  // "video/quicktime"
]

const maxFileSize = 1024 * 1024 * 1.2 // 1.2 MB

type GetSignedURLParams = {
  fileType: string
  fileSize: number
  checksum: string
}

export async function getSignedURL({
  fileType,
  fileSize,
  checksum
}: GetSignedURLParams): Promise<SignedURLResponse> {
  const tServer = await getTranslations("BoardForm.server")
  const tError = await getTranslations("Common.error")

  const user = await currentUser()

  if (!user) {
    return { error: tError("unauthorized") }
  }

  if (!allowedFileTypes.includes(fileType)) {
    return { error: tServer("error.fileTypeNotAllowed") }
  }

  if (fileSize > maxFileSize) {
    return { error: tServer("error.fileSizeTooLarge", { maxSize: formatFileSize(maxFileSize)}) }
  }

  const userId = user._id.toString()

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

    // console.log("Generated Signed URL:", url)
    
    return { success: { url } }
  } catch (error) {
    console.error("Error generating signed URL", error)
    return { error: tServer("error.signedUrlFailed") }
  }
}