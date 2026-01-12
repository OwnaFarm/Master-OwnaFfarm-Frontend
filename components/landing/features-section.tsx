"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"

export function FeaturesSection() {
  const { t } = useI18n()

  const features = [
    {
      titleKey: "features.feature1Title",
      descKey: "features.feature1Desc",
      image: "/blockchain-network-visualization-green-nodes-conne.jpg",
    },
    {
      titleKey: "features.feature2Title",
      descKey: "features.feature2Desc",
      image: "/cctv-farm-monitoring-dashboard-multiple-camera-vie.jpg",
    },
    {
      titleKey: "features.feature3Title",
      descKey: "features.feature3Desc",
      image: "/gamified-farm-game-interface-colorful-plants-growi.jpg",
    },
    {
      titleKey: "features.feature4Title",
      descKey: "features.feature4Desc",
      image: "/business-handshake-partnership-agreement-food-comp.jpg",
    },
    {
      titleKey: "features.feature5Title",
      descKey: "features.feature5Desc",
      image: "/profit-chart-green-upward-trend-coins-harvest-cele.jpg",
    },
    {
      titleKey: "features.feature6Title",
      descKey: "features.feature6Desc",
      image: "/farm-browsing-dashboard-interface-green-crops-card.jpg",
    },
  ]

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-pixel text-primary mb-4 tracking-wider uppercase">{t("features.title")}</p>
          <h2 className="text-3xl md:text-4xl font-pixel text-foreground mb-4">{t("features.subtitle")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="pixel-border bg-card rounded-lg overflow-hidden group hover:shadow-xl hover-scale transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={t(feature.titleKey)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-foreground/10" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-pixel text-foreground mb-3">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(feature.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
