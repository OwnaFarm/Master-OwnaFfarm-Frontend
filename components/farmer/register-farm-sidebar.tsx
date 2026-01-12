"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n"

export function RegisterFarmSidebar() {
  const { t } = useI18n()

  const benefits = [
    t("registerFarm.benefits.funding"),
    t("registerFarm.benefits.contracts"),
    t("registerFarm.benefits.monitoring"),
    t("registerFarm.benefits.settlement"),
  ]

  return (
    <div className="lg:sticky lg:top-28">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-pixel text-foreground mb-3 sm:mb-4">
        {t("registerFarm.pageTitle")}
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">{t("registerFarm.pageDescription")}</p>

      {/* Benefits */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
            </div>
            <span className="text-sm sm:text-base text-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Decorative Image - Hidden on small screens, smaller on medium */}
      <div className="hidden sm:block relative aspect-video max-w-sm rounded-2xl overflow-hidden">
        <Image src="/indonesian-farmer-in-rice-field-smiling.jpg" alt="Indonesian Farmer" fill className="object-cover" />
      </div>
    </div>
  )
}
