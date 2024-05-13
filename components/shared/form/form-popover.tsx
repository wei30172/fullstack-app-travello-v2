"use client"

import { ElementRef, useRef } from "react"
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
  const closeRef = useRef<ElementRef<"button">>(null)
  
  const handleClosePopover = () => {
    closeRef.current?.click()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={`w-80 pt-3 ${className}`}
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-teal-900"
            variant="ghost"
          >
            <IoMdClose className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <BoardForm
          type="Create"
          onClose={handleClosePopover}
        />
      </PopoverContent>
    </Popover>
  )
}
