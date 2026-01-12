"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2, Tractor } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function CtaSection() {
  const { t } = useI18n()

  return (
    <section className="py-24 bg-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image src="/agricultural-field-pattern-aerial-view.jpg" alt="Pattern" fill className="object-cover" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="relative w-20 h-20 mx-auto mb-8">
            <Image
              src="/ownafarm-logo.webp"
              alt="Launch"
              fill
              className="object-contain rounded-xl"
            />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-pixel text-accent-foreground mb-6">{t("cta.title")}</h2>
          <p className="text-lg md:text-xl text-accent-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">{t("cta.description")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="pixel-button bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-pixel uppercase rounded-md"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              {t("cta.launchGame")}
            </Button>
            <Button
              size="lg"
              asChild
              className="pixel-button bg-accent-foreground hover:bg-accent-foreground/90 text-accent px-10 py-6 text-lg font-pixel uppercase rounded-md"
            >
              <Link href="/register-farm">
                <Tractor className="w-5 h-5 mr-2" />
                {t("cta.registerFarm")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
