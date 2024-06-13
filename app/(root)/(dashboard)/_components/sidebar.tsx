import { SidebarLinks } from "./sidebar-links"
import { FiMap } from "react-icons/fi"

export const Sidebar = () => {
  const routes = [
    {
      label: "Trips",
      icon: <FiMap className="h-4 w-4 mr-2" />,
      href: "/boards",
    },
    // {
    //   label: "Billing",
    //   icon: <FiCreditCard className="h-4 w-4 mr-2" />,
    //   href: "/billing",
    // },
  ]

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-4 pl-4 pt-4">
        <span className="text-lg text-teal-900">
          Workspace
        </span>
      </div>
      <SidebarLinks routes={routes}/>
    </>
  )
}
