import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const handleSelectContentRef = (ref: HTMLDivElement | null) => {
  if (!ref) return
  ref.ontouchstart = (e: TouchEvent) => { e.preventDefault() }
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i]
}

export const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

// export const generateFileName = (bytes = 32) => {
//   const array = new Uint8Array(bytes)
//   crypto.getRandomValues(array)
//   return [...array].map((b) => b.toString(16).padStart(2, "0")).join("")
// }
