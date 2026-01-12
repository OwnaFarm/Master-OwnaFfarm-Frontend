"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function RegisterFarmHeader() {
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between lg:pl-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm sm:text-base">{t("common.backToHome")}</span>
        </Link>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image src="/green-leaf-farm-logo.jpg" alt="OwnaFarm" width={40} height={40} className="object-cover" />
          </div>
          <span className="text-lg sm:text-xl font-pixel text-foreground">OwnaFarm</span>
        </div>
        <div className="w-20 sm:w-24 lg:hidden" />
        <div className="hidden lg:block" />
      </div>
    </header>
  )
}
