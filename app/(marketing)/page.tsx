import Link from "next/link"
import Image from 'next/image'

import { cn } from "@/lib/utils"
import { textFont } from "@/lib/fonts"
import { Button } from "@/components/ui/button"

const MarketingPage = () => {
  return (
    <section className="flex items-center justify-center flex-col text-gray-700">
      <div className="text-center mb-2">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Plan with Travello
        </h1>
        <p className="text-lg md:text-xl">
          Simplify your journey with intuitive drag & drop planning
        </p>
      </div>
      <div className="max-w-md md:max-w-lg text-center mb-6">
        <Image
          src="/images/travel-hero-image.png"
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
        Explore new destinations and effortlessly plan your trips with Travello&apos;s easy-to-use drag & drop interface. Travel planning made simple and fun.
      </div>
      <Button
        className="my-4"
        variant="primary"
        size="lg"
        asChild
      >
        <Link className="py-2 px-4" href="/signup">
          Start Your Journey
        </Link>
      </Button>
    </section>
  )
}

export default MarketingPage