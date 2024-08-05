"use client"

import { useCoverModal } from "@/hooks/use-cover-modal"
import { Button } from "@/components/ui/button"
import { IoImage } from "react-icons/io5"

export const BoardCoverButton = () => {
  const coverImage = useCoverModal()

  return (
    <Button
      className="h-auto w-auto p-2"
      variant="transparent"
      aria-label="Board Cover Button"
      onClick={() => coverImage.onOpen()}
    >
      <IoImage className="h-6 w-6" />
    </Button>
  )
}