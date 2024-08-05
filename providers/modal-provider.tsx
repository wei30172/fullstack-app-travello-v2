"use client"

import { useEffect, useState } from "react"

import { CardModal } from "@/components/shared/modal/card-modal"
import { CoverImageModal } from "@/components/shared/modal/cover-image-modal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CardModal />
      <CoverImageModal />
    </>
  )
}