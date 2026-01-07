"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { UserPlus, Search, Coins, TrendingUp, FileCheck, MapPin, Banknote, Truck } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function HowItWorksSection() {
  const { t } = useI18n()

  const investorSteps = [
    {
      step: "01",
      titleKey: "howItWorks.step1Title",
      descKey: "howItWorks.step1Desc",
      icon: <UserPlus className="w-8 h-8 text-primary" />,
      image: "/mobile-app-signup-screen-modern-clean-green-theme.jpg",
    },
    {
      step: "02",
      titleKey: "howItWorks.step2Title",
      descKey: "howItWorks.step2Desc",
      icon: <Search className="w-8 h-8 text-primary" />,
      image: "/farm-browsing-dashboard-interface-green-crops-card.jpg",
    },
    {
      step: "03",
      titleKey: "howItWorks.step3Title",
      descKey: "howItWorks.step3Desc",
      icon: <Coins className="w-8 h-8 text-primary" />,
      image: "/gamified-investment-interface-progress-bars-green-.jpg",
    },
    {
      step: "04",
      titleKey: "howItWorks.step4Title",
      descKey: "howItWorks.step4Desc",
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      image: "/profit-chart-green-upward-trend-coins-harvest-cele.jpg",
    },
  ]

  const farmerSteps = [
    {
      step: "01",
      titleKey: "howItWorks.farmerStep1Title",
      descKey: "howItWorks.farmerStep1Desc",
      icon: <FileCheck className="w-8 h-8 text-secondary" />,
      image: "/farmer-registration-form-documents-verification-mo.jpg",
    },
    {
      step: "02",
      titleKey: "howItWorks.farmerStep2Title",
      descKey: "howItWorks.farmerStep2Desc",
      icon: <MapPin className="w-8 h-8 text-secondary" />,
      image: "/farm-listing-form-with-map-location-photos-upload-.jpg",
    },
    {
      step: "03",
      titleKey: "howItWorks.farmerStep3Title",
      descKey: "howItWorks.farmerStep3Desc",
      icon: <Banknote className="w-8 h-8 text-secondary" />,
      image: "/funding-received-notification-celebration-farmer-h.jpg",
    },
    {
      step: "04",
      titleKey: "howItWorks.farmerStep4Title",
      descKey: "howItWorks.farmerStep4Desc",
      icon: <Truck className="w-8 h-8 text-secondary" />,
      image: "/harvest-delivery-truck-farm-to-factory-green-crops.jpg",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary mb-4 tracking-wider uppercase">{t("howItWorks.title")}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("howItWorks.subtitle")}</h2>
        </motion.div>

        {/* Investor Flow */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{t("about.forInvestors")}</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 relative group hover:shadow-lg transition-shadow"
              >
                <span className="absolute top-4 right-4 text-5xl font-bold text-muted/50">{step.step}</span>
                <div className="relative w-full h-24 mb-4 rounded-xl overflow-hidden">
                  <Image src={step.image || "/placeholder.svg"} alt={t(step.titleKey)} fill className="object-cover" />
                </div>
                <div className="mb-4">{step.icon}</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{t(step.titleKey)}</h4>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Farmer Flow */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{t("about.forFarmers")}</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmerSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 relative group hover:shadow-lg transition-shadow"
              >
                <span className="absolute top-4 right-4 text-5xl font-bold text-muted/50">{step.step}</span>
                <div className="relative w-full h-24 mb-4 rounded-xl overflow-hidden">
                  <Image src={step.image || "/placeholder.svg"} alt={t(step.titleKey)} fill className="object-cover" />
                </div>
                <div className="mb-4">{step.icon}</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{t(step.titleKey)}</h4>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
