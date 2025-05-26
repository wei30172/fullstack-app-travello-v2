import s3Client from "@/lib/s3client"
import { authorizeInternalRequest } from "@/middleware/internal-auth"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextRequest, NextResponse } from "next/server"
import { formatFileSize, generateFileName } from "@/lib/file"
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/constants/files"

// POST /api/board/signed-url
export async function POST(req: NextRequest) {
  const authError = await authorizeInternalRequest(req, ["file-uploader"])
  if (authError) return authError

  try {
    const { fileType, fileSize, checksum } = await req.json()

    // Check if the file type is allowed
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }
  
    // Check if the file size exceeds the maximum limit
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size too large. Maximum allowed size is ${formatFileSize(MAX_FILE_SIZE)}.` },
        { status: 400 }
      )
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
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}