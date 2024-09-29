import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import "./globals.css"

import ThemeProvider from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { Toaster } from "@/components/ui/toaster"

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

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

export default async function AppLayout({
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
            <QueryProvider>
              <Toaster />
              <ModalProvider />
              {children}
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
