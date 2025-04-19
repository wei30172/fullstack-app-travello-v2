import Link from "next/link"
import {useTranslations} from "next-intl"

import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "@/components/shared/button/locale-switcher"

export const MarketingNavbar = () => {
  const tUi = useTranslations("Navbar.ui")
  
  return (
    <div className="fixed top-0 w-full h-12 px-4 border-b shadow-sm bg-gray-100 dark:bg-gray-900 flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="flex items-center justify-end w-full space-x-4">
          <LocaleSwitcher />
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">
              {tUi("signin")}
            </Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/signup">
              {tUi("signup")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}