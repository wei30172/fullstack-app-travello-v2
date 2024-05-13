import Link from "next/link"

import { Logo } from "@/components/shared/logo"
// import { Footerlinks } from "./footer-links"

export const RootFooter = () => {
  return (
    <footer className="flex flex-col text-gray-500 text-sm mt-5 border-t border-gray-100">
      {/* <Footerlinks /> */}
      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 gap-8 px-6 py-2 sm:px-20">
        <div className="flex items-center gap-2">
          <Logo />
          <p className="text-gray-900 dark:text-gray-200">
            &copy; Web
          </p>
        </div>
        <div className="flex max-sm:flex-col gap-2 sm:gap-4">
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