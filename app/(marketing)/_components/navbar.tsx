import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"

export const MarketingNavbar = () => {
  return (
    <div className="fixed top-0 w-full h-12 px-4 border-b shadow-sm bg-gray-100 dark:bg-gray-900 flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-end w-full">
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">
              Login
            </Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/signup">
              Try Travello for free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}