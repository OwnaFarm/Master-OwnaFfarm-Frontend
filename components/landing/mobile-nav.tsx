"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Gamepad2, Tractor, Globe, Settings } from "lucide-react"
import { useI18n, localeNames } from "@/lib/i18n"

export function MobileNav() {
  const { locale, setLocale, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)

  const navItems = [
    { id: "home", href: "#home" },
    { id: "about", href: "#about" },
    { id: "howItWorks", href: "#how-it-works" },
    { id: "features", href: "#features" },
    { id: "partners", href: "#partners" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.replace("#", ""))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {t(`nav.${item.id}`)}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-3 mt-4"
              >
                <button
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-lg">{t("nav.settings")}</span>
                </button>

                <AnimatePresence>
                  {showLanguages && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Globe className="w-4 h-4" />
                        <span>{t("settings.language")}</span>
                      </div>
                      <div className="flex gap-2">
                        {(Object.keys(localeNames) as Array<keyof typeof localeNames>).map((loc) => (
                          <button
                            key={loc}
                            onClick={() => {
                              setLocale(loc)
                              setShowLanguages(false)
                            }}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                              locale === loc
                                ? "bg-primary text-primary-foreground font-medium"
                                : "bg-muted hover:bg-muted/80 text-foreground"
                            }`}
                          >
                            {localeNames[loc]}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
                <motion.a
                  href="#"
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Gamepad2 className="w-5 h-5" />
                  {t("hero.launchGame")}
                </motion.a>
                <motion.a
                  href="/register-farm"
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Tractor className="w-5 h-5" />
                  {t("hero.registerFarm")}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
