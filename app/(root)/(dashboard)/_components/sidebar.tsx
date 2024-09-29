"use client"

import { useMediaQuery } from "usehooks-ts"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { SidebarLinks } from "./sidebar-links"
import { TrashBox } from "./trash-box"
import { FiSettings, FiMap, FiCreditCard, FiTrash } from "react-icons/fi"

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const routes = [
    {
      icon: <FiSettings className="h-4 w-4 mr-2" />,
      label: "Settings",
      url: "/settings"
    },
    {
      icon: <FiMap className="h-4 w-4 mr-2" />,
      label: "Trips",
      url: "/boards"
    },
    {
      icon: <FiCreditCard className="h-4 w-4 mr-2" />,
      label: "Billing",
      url: "/billing"
    }
  ]

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-4 pl-4 pt-4">
        <span className="text-lg text-teal-900">
          Workspace
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
            Trash
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
