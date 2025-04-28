import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

import { Logo } from "@/components/shared/logo"

export const MarketingFooter = () => {
  const tUi = useTranslations("Footer.ui")

  return (
    <footer className="fixed bottom-0 w-full flex flex-col text-gray-500 text-sm border-t bg-gray-100 dark:bg-gray-900 border-gray-500">
      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 gap-2 px-6 py-2 sm:px-20">
        <div className="flex items-center gap-2">
          <Logo />
          <p className="text-gray-900 dark:text-gray-200">
            &copy; 2024 Wei. All rights reserved.
          </p>
        </div>
        <div className="flex gap-1 sm:gap-4 text-xs">
          <Link href="/">{tUi("privacy")}</Link>
          <Link href="/">{tUi("terms")}</Link>
        </div>
      </div>
    </footer>
  )
}