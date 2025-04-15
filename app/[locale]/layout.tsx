import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { Locale, routing } from "@/i18n/routing"
import { auth } from "@/auth"
import "./globals.css"

import ThemeProvider from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ModalProvider } from "@/providers/modal-provider"
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

export default async function AppLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }
  
  const messages = await getMessages()
  const session = await auth()

  // console.log({locale, messages})

  return ( 
    <html suppressHydrationWarning lang={locale}>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Toaster />
              <ModalProvider />
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </QueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
