"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useCurrentUser } from "@/hooks/use-session"
import { useTranslations } from "next-intl"

import { FaRegUserCircle } from "react-icons/fa"
import { IoMdLogIn, IoMdLogOut } from "react-icons/io"
import { FiSettings, FiMap } from "react-icons/fi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { SignInButton } from "@/components/shared/button/signin-button"
import { SignOutButton } from "@/components/shared/button/signout-button"

interface NavLink {
  icon: React.ReactNode,
  label: string
  url: string
}

interface UserNavLinksProps {
  userNavLinks: NavLink[]
  pathName: string
}

const UserNavLinks = ({
  userNavLinks,
  pathName
}:  UserNavLinksProps) => (
  userNavLinks.map((link) => (
    <DropdownMenuItem key={link.label}>
      <Link
        href={link.url}
        className={cn(
          "py-1 text-sm transition-colors flex items-center",
          pathName === link.url ? "text-black dark:text-white" : "text-muted-foreground"
        )}
      >
        <span className="mr-2">{link.icon}</span>
        {link.label}
      </Link>
    </DropdownMenuItem>
  ))
)

export const AuthLink = ({ isSignedIn = false }: { isSignedIn?: boolean }) => {
  const tUi = useTranslations("Navbar.ui")

  return isSignedIn ? (
    <SignOutButton>
      <IoMdLogOut className="h-4 w-4 mr-2"/>
      {tUi("signout")}
    </SignOutButton>
  ) : (
    <SignInButton>
      <IoMdLogIn className="h-4 w-4 mr-2"/>
      {tUi("signin")}
    </SignInButton>
  )
}

export const UserButton = () => {
  const pathName = usePathname()
  const user = useCurrentUser()
  // console.log({user})

  const tUi = useTranslations("Navbar.ui")

  const userNavLinks = [
    {
      icon: <FiSettings />,
      label: tUi("settings"),
      url: "/settings"
    },
    {
      icon: <FiMap />,
      label: tUi("trips"),
      url: "/boards"
    }
    // {
    //   icon: <FiCreditCard />,
    //   label: tUi("billing"),
    //   url: "/billing"
    // }
  ]
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-primary-500">
            <FaRegUserCircle className="h-full w-full"/>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
      {user && (
      <>
        <UserNavLinks userNavLinks={userNavLinks} pathName={pathName}/>
        <DropdownMenuSeparator />
      </>
      )}
        <DropdownMenuItem>
          <AuthLink isSignedIn={!!user} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
