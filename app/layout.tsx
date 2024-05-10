import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import "./globals.css"

import ThemeProvider from "@/providers/theme-provider"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Travello",
    template: `%s | Travello`,
  },
  description: "Discover, plan, and enjoy your perfect trip with ease and fun",
  icons: [
    {
      url: "/images/logo.png",
      href: "/images/logo.png"
    }
  ]
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html suppressHydrationWarning lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex h-full flex-col items-center justify-center">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
