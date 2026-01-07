"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Settings, Globe } from "lucide-react"
import Link from "next/link"
import { useI18n, localeNames } from "@/lib/i18n"

export function FormFloatingNav() {
  const { locale, setLocale, t } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false)
        setShowSettings(false)
      }}
    >
      <motion.div
        className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-3 shadow-xl"
        animate={{ width: isExpanded ? 200 : 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col gap-2">
          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 overflow-hidden hover:bg-muted text-foreground"
          >
            <div className="flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {t("common.backToHome")}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Divider */}
          <div className="h-px bg-border my-1" />

          {/* Settings Button */}
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 overflow-hidden ${
              showSettings ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"
            }`}
          >
            <div className="flex-shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {t("nav.settings")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Language Selector */}
          <AnimatePresence>
            {showSettings && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pl-2 py-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Globe className="w-3 h-3" />
                    <span>{t("settings.language")}</span>
                  </div>
                  {(Object.keys(localeNames) as Array<keyof typeof localeNames>).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocale(loc)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        locale === loc ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.nav>
  )
}
