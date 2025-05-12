"use client"

import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface RouteItem {
  label: string
  icon: React.ReactNode
  url: string
}

interface NavItemsProps {
  routes: RouteItem[]
}

export const SidebarLinks = ({ routes }: NavItemsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const cleanPathname = pathname.replace(`/${locale}`, "")

  const onClick = (url: string) => {
    router.push(url)
  }
  return (
    <div className="pt-1 text-gray-900 dark:text-gray-200">
      {routes.map((route) => (
        <Button
          key={route.url}
          size="lg"
          onClick={() => onClick(route.url)}
          className={cn(
            "w-full font-normal justify-start pl-10 mb-1 text-sm",
            cleanPathname === route.url && "bg-teal-500/10 text-teal-700"
          )}
          variant="ghost"
        >
          {route.icon}
          {route.label}
        </Button>
      ))}
    </div>
  )
}