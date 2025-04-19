"use client"

import { useMediaQuery } from "usehooks-ts"
import {useTranslations} from "next-intl"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { SidebarLinks } from "./sidebar-links"
import { TrashBox } from "./trash-box"
import { FiSettings, FiMap, FiTrash } from "react-icons/fi"

export const Sidebar = () => {
  const tUi = useTranslations("Navbar.ui")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const routes = [
    {
      icon: <FiSettings className="h-4 w-4 mr-2" />,
      label: tUi("settings"),
      url: "/settings"
    },
    {
      icon: <FiMap className="h-4 w-4 mr-2" />,
      label: tUi("trips"),
      url: "/boards"
    }
    // {
    //   icon: <FiCreditCard className="h-4 w-4 mr-2" />,
    //   label: tUi("billing"),
    //   url: "/billing"
    // }
  ]

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-4 pl-4 pt-4">
        <span className="text-lg text-teal-900">
          {tUi("workspace")}
        </span>
      </div>
      <SidebarLinks routes={routes}/>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="w-full font-normal justify-start pl-10 mb-1 text-sm"
            variant="ghost"
          >
            <FiTrash className="h-4 w-4 mr-2"/>
            {tUi("trash")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-72"
          side={isMobile ? "bottom" : "right"}
        >
          <TrashBox />
        </PopoverContent>
      </Popover>
    </>
  )
}
