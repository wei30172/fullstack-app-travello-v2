import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { textFont } from "@/lib/fonts"

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition md:flex md:items-center md:gap-x-2">
        <Image
          src="/images/logo.png"
          alt="Logo"
          height={30}
          width={30}
        />
        <p className={cn(
          "text-lg text-teal-700 pb-1 font-bold hidden md:block",
          textFont.className,
        )}>
          Travello
        </p>
      </div>
    </Link>
  )
}