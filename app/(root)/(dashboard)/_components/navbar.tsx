import { Button } from "@/components/ui/button"
import { FormPopover } from "@/components/shared/form/form-popover"
import { MobileSidebar } from "./mobile-sidebar"
import { FiPlus } from "react-icons/fi"

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 mx-12 md:mx-36 h-16 flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <FormPopover align="start" sideOffset={6}>
          <Button variant="primary" size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2">
            Create
          </Button>
        </FormPopover>
        <FormPopover sideOffset={8}>
          <Button variant="primary" size="sm" className="rounded-sm block md:hidden">
            <FiPlus className="h-4 w-4" />
          </Button>
        </FormPopover>
      </div>
    </nav>
  )
}