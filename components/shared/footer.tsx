import Link from "next/link"
import { footerLinks } from "@/constants"

import { SiAuth0 } from "react-icons/si"

export const Footer = () => {
  return (
    <footer className="flex flex-col text-gray-500 text-sm mt-5 border-t border-gray-100">
      <div className="flex flex-wrap justify-center max-sm:flex-col gap-10 px-6 py-10 sm:gap-20">
        {footerLinks.map((links) => (
          <div key={links.title}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">
              {links.title}
            </h3>
            <div className="flex flex-col gap-2">
              {links.links.map((link) => (
                <Link
                  key={link.title}
                  href={link.url}
                  className="md:text-xs"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}

      </div>
      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 gap-8 px-6 py-2 sm:px-20">
        <div className="flex items-center gap-2">
          <SiAuth0 />
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