import s3Client from "@/lib/s3client"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"
import { formatFileSize, generateFileName } from "@/lib/utils"

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  // "video/mp4",
  // "video/quicktime"
]

const maxFileSize = 1024 * 1024 * 1.2 // 1.2 MB

// api/board/upload-to-s3
export async function POST(
  req: Request
) {
  try {
    const { fileType, fileSize, checksum } = await req.json()

    if (!allowedFileTypes.includes(fileType)) {
      return new NextResponse("File type not allowed", { status: 400 } )
    }
  
    if (fileSize > maxFileSize) {
      return new NextResponse(`File size too large. Maximum allowed size is ${formatFileSize(maxFileSize)}.`, { status: 400 } )
    }
  
    const newFileName = generateFileName()
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: newFileName,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum
    })

    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // 60s
    )

    console.log("Generated Signed URL:", url)
    return NextResponse.json({ url })
    
  } catch (error) {
    console.error("[ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}