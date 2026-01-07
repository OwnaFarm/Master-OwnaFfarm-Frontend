"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"

export function StatsSection() {
  const { t } = useI18n()

  const stats = [
    {
      value: "$2.5M+",
      labelKey: "stats.totalInvested",
      image: "/vault-safe-money-locked-minimalist.jpg",
    },
    {
      value: "500+",
      labelKey: "stats.activeFarms",
      image: "/farmer-person-agriculture-minimalist.jpg",
    },
    {
      value: "$1.8M",
      labelKey: "stats.harvestCompleted",
      image: "/coins-money-stack-minimalist.jpg",
    },
    {
      value: "18%",
      labelKey: "stats.investorReturns",
      image: "/chart-growth-upward-minimalist.jpg",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-12 h-12 mx-auto mb-4">
                <Image
                  src={stat.image || "/placeholder.svg"}
                  alt={t(stat.labelKey)}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
