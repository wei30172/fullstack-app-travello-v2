import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { textFont } from "@/lib/fonts"
import { Button } from "@/components/ui/button"

const MarketingPage = () => {
  const tUi = useTranslations("HomePage.ui")
  return (
    <section className="flex items-center justify-center flex-col text-gray-700">
      <div className="text-center mb-2">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {tUi("title")}
        </h1>
        <p className="text-lg md:text-xl">
          {tUi("subtitle")}
        </p>
      </div>
      <div className="max-w-md md:max-w-lg text-center mb-6">
        <Image
          src="/images/travello-hero-image.png"
          alt="Travel Image"
          className="rounded-lg shadow-md"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className={cn(
        "text-sm md:text-lg max-w-xs md:max-w-2xl text-center mx-auto",
        textFont.className
      )}>
        {tUi("description")}
      </div>
      <Button
        className="my-4"
        variant="primary"
        size="lg"
        asChild
      >
        <Link className="py-2 px-4" href="/signup">
          {tUi("link")}
        </Link>
      </Button>
    </section>
  )
}

export default MarketingPage