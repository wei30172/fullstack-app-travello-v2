import Link from "next/link"
import { footerLinks } from "@/constants/links"

export const Footerlinks = () => {
  return (
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
  )
}