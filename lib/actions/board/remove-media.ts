"use server"

import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import s3Client from "@/lib/s3client"
import connectDB from "@/lib/db"
import { Media } from "@/lib/models/board.model"

export const removeMedia = async (
  url: string
) => {
  try {
    const fileName = url.split("/").pop()
    if (fileName) {
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName
      })
      await s3Client.send(deleteObjectCommand)
      console.log(`Deleted old file from S3: ${fileName}`)
    }

    await connectDB()
    
    const result = await Media.deleteOne({ url })
    if (result.deletedCount === 0) {
      console.warn(`No media information found for URL: ${url}`)
    } else {
      console.log(`Removed media information for URL: ${url}`)
    }
    return { success: true }
  } catch (error) {
    console.error(`Error removing media information for URL: ${url}`, error)
    return { error: "Failed to remove media information" }
  }
}