"use client"

import { useState } from "react"
import { IoMdClose } from "react-icons/io"

import { BoardForm } from "@/components/shared/board-form"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover"

interface FormPopoverProps {
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
  align?: "start" | "center" | "end"
  sideOffset?: number
  className?: string
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
  className
}: FormPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <Popover open={isPopoverOpen} onOpenChange={
      // Only changes state when open, closing is controlled by the close button
      (open) => {
        if (open) {
          setIsPopoverOpen(true)
        }
      }
    }>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={`w-[350px] pt-3 ${className}`}
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900"
            variant="ghost"
            aria-label="Close popover"
            onClick={() => setIsPopoverOpen(false)}
          >
            <IoMdClose className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <BoardForm
          type="Create"
          onClose={() => setIsPopoverOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}
