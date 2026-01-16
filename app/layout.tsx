import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Geist_Mono, Press_Start_2P } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n"
import { PrivyProviderWrapper } from "@/components/providers/privy-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "OwnaFarm - Gamified Agricultural Investment",
  description:
    "Invest in real farms, earn real yields. Play, grow, and prosper with gamified agricultural investments.",
  generator: "OwnaFarm",
  keywords: ["agriculture", "investment", "farming", "blockchain", "gamification"],
}

export const viewport: Viewport = {
  themeColor: "#3d7a3d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${geistMono.variable} ${pressStart.variable} font-sans antialiased`}>
        <PrivyProviderWrapper>
          <I18nProvider>{children}</I18nProvider>
          <Toaster />
        </PrivyProviderWrapper>
        <Analytics />
      </body>
    </html>
  )
}
