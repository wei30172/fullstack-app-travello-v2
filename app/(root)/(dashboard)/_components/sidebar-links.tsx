"use client"

import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface RouteItem {
  label: string
  icon: React.ReactNode
  href: string
}

interface NavItemsProps {
  routes: RouteItem[]
}

export const SidebarLinks = ({ routes }: NavItemsProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const onClick = (href: string) => {
    router.push(href)
  }
  return (
    <div className="pt-1 text-gray-900 dark:text-gray-200">
      {routes.map((route) => (
        <Button
          key={route.href}
          size="lg"
          onClick={() => onClick(route.href)}
          className={cn(
            "w-full font-normal justify-start pl-10 mb-1 text-sm",
            pathname === route.href && "bg-teal-500/10 text-teal-700"
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