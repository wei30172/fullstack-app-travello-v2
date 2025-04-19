"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { FiMenu } from "react-icons/fi"

export const MobileSidebar = () => {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  const onOpen = useMobileSidebar((state) => state.onOpen)
  const onClose = useMobileSidebar((state) => state.onClose)
  const isOpen = useMobileSidebar((state) => state.isOpen)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
      >
        <FiMenu className="h-6 w-6" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className="p-2 pt-10 text-teal-700 h-full"
        >
          <Sidebar />
        </SheetContent>
      </Sheet>
    </>
  )
}