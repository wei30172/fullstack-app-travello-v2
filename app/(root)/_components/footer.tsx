import Link from "next/link"

import { Logo } from "@/components/shared/logo"
// import { Footerlinks } from "./footer-links"

export const RootFooter = () => {
  return (
    <footer className="fixed bottom-0 w-full flex flex-col text-gray-500 text-sm border-t bg-gray-100 dark:bg-gray-900 border-gray-500">
      {/* <Footerlinks /> */}
      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 gap-2 px-6 py-2 sm:px-20">
        <div className="flex items-center gap-2">
          <Logo />
          <p className="text-gray-900 dark:text-gray-200">
            &copy; 2024 Wei. All rights reserved.
          </p>
        </div>
        <div className="flex max-sm:flex-col gap-1 sm:gap-4 text-xs">
          <Link href="/">
            Privacy Notice
          </Link>
          <Link href="/">
            Conditions of Use
          </Link>
        </div>
      </div>
    </footer>
  )
}