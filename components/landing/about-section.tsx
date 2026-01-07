"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle, Eye, Shield } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function AboutSection() {
  const { t } = useI18n()

  const features = [
    {
      titleKey: "about.forInvestors",
      descKey: "about.forInvestorsDesc",
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
    },
    {
      titleKey: "about.forFarmers",
      descKey: "about.forFarmersDesc",
      icon: <Eye className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/indonesian-farmer-smiling-in-green-rice-field-wear.jpg"
                alt="Indonesian Farmer"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl p-6 shadow-xl max-w-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t("partners.title")}</p>
                  <p className="text-sm text-muted-foreground">{t("partners.subtitle")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-semibold text-primary mb-4 tracking-wider uppercase">{t("about.title")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{t("about.subtitle")}</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t("about.description")}</p>

            <div className="space-y-6">
              {features.map((item, index) => (
                <motion.div
                  key={item.titleKey}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t(item.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
