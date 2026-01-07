"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"

const partners = [
  { name: "Indofood", image: "/indofood-logo.jpg" },
  { name: "Mayora", image: "/mayora-logo.jpg" },
  { name: "Sinar Mas", image: "/sinar-mas-logo.jpg" },
  { name: "Wilmar", image: "/wilmar-logo.jpg" },
  { name: "Charoen Pokphand", image: "/charoen-pokphand-logo.jpg" },
  { name: "Japfa", image: "/japfa-logo.jpg" },
]

export function PartnersSection() {
  const { t } = useI18n()

  return (
    <section id="partners" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary mb-4 tracking-wider uppercase">{t("partners.title")}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("partners.subtitle")}</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-24 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="relative w-full h-10">
                <Image src={partner.image || "/placeholder.svg"} alt={partner.name} fill className="object-contain" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
