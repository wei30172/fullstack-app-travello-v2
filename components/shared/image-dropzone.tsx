"use client"

import { useMemo, useCallback } from "react"
import Image from "next/image"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { twMerge } from "tailwind-merge"
import { useTranslations } from "next-intl"

import { Spinner } from "@/components/shared/spinner"
import { Button } from "@/components/ui/button"
import { IoMdCloudUpload, IoMdCloseCircle } from "react-icons/io"

const variants = {
  base: "relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  image:
    "border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-gray-200 dark:bg-gray-900 rounded-md",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10"
}

type ImageDropzoneProps = {
  width?: number
  height?: number
  className?: string
  value?: File | string
  onChange?: (file?: File) => void | Promise<void>
  onSubmit?: () => void | Promise<void>
  disabled?: boolean
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">
}

export const ImageDropzone = ({
  width,
  height,
  className,
  value,
  disabled,
  onChange,
  onSubmit,
  dropzoneOptions
}: ImageDropzoneProps) => {
  const tUi = useTranslations("BoardForm.ui")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      void onChange?.(file)
    }
  }, [onChange])
  
  const handleSubmit = () => {
    if (value && typeof value !== "string") {
      void onSubmit?.()
    }
  }

  const imageUrl = useMemo(() => {
    if (typeof value === "string") {
      return value
    } else if (value) {
      return URL.createObjectURL(value)
    }
    return null
  }, [value])

  // Initialize useDropzone
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { 
      "image/jpeg": [], 
      "image/png": [], 
      "image/webp": []
    },
    multiple: false,
    disabled,
    onDrop,
    ...dropzoneOptions
  })

  // Determine dropzone class name
  const dropZoneClassName = useMemo(
    () =>
      twMerge(
        variants.base,
        isFocused && variants.active,
        disabled && variants.disabled,
        imageUrl && variants.image,
        (isDragReject ?? fileRejections[0]) && variants.reject,
        isDragAccept && variants.accept,
        className,
      ).trim(),
    [
      isFocused,
      imageUrl,
      fileRejections,
      isDragAccept,
      isDragReject,
      disabled,
      className
    ]
  )

  return (
    <div className="relative">
      {/* Display spinner when disabled */}
      {disabled && (
        <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50">
          <Spinner size="lg" />
        </div>
      )}
      <div
        {...getRootProps({
          className: dropZoneClassName,
          style: { width, height }
        })}
      >
        <input {...getInputProps()} />

        {/* Display image or upload prompt */}
        {imageUrl ? (
          <Image
            className="h-full w-full rounded-md object-cover"
            src={imageUrl}
            alt={acceptedFiles[0]?.name || "Uploaded image"}
            width={500}
            height={500}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-xs text-gray-400">
            <IoMdCloudUpload className="mb-2 h-7 w-7" />
            <div className="text-gray-400">
              {tUi("coverUploadPrompt")}
            </div>
          </div>
        )}

        {/* Display remove button */}
        {imageUrl && !disabled && (
          <div
            className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4"
            onClick={(e) => {
              e.stopPropagation()
              void onChange?.(undefined)
            }}
          >
            <IoMdCloseCircle
              className="h-6 w-6 text-gray-300"
            />
          </div>
        )}
      </div>
      {value && typeof value !== "string" && (
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleSubmit}
            disabled={disabled}
          >
            {tUi("coverSubmitButton")}
          </Button>
        </div>
      )}
    </div>
  )
}

ImageDropzone.displayName = "ImageDropzone"