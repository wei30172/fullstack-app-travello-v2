import s3Client from "@/lib/s3client"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"
import { formatFileSize, generateFileName } from "@/lib/utils"

// Allowed file types for upload
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  // "video/mp4",
  // "video/quicktime"
]

// Maximum file size (1.2 MB)
const MAX_FILE_SIZE = 1024 * 1024 * 1.2

// api/board/upload-to-s3
export async function POST(
  req: Request
) {
  try {
    const { fileType, fileSize, checksum } = await req.json()

    // Check if the file type is allowed
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return new NextResponse("File type not allowed", { status: 400 } )
    }
  
    // Check if the file size exceeds the maximum limit
    if (fileSize > MAX_FILE_SIZE) {
      return new NextResponse(`File size too large. Maximum allowed size is ${formatFileSize(MAX_FILE_SIZE)}.`, { status: 400 } )
    }
  
     // Generate a unique file name and create the S3 upload command
    const newFileName = generateFileName()
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: newFileName,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum
    })

    // Generate a signed URL for uploading the file
    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // URL valid for 60s
    )

    // console.log("Generated Signed URL:", url)
    return NextResponse.json({ url })
    
  } catch (error) {
    console.error("[ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}