"use client"

import { useEffect, useState } from "react"

import { ProModal } from "@/components/shared/modal/pro-modal"
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
      <ProModal />
      <CardModal />
      <CoverImageModal />
    </>
  )
}