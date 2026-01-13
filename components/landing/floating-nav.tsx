"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Info, Workflow, Sparkles, Handshake, Shield, Settings, Globe } from "lucide-react"
import { useI18n, localeNames } from "@/lib/i18n"

interface NavItem {
  id: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: "home", href: "#home", icon: <Home className="w-5 h-5" /> },
  { id: "about", href: "#about", icon: <Info className="w-5 h-5" /> },
  { id: "howItWorks", href: "#how-it-works", icon: <Workflow className="w-5 h-5" /> },
  { id: "features", href: "#features", icon: <Sparkles className="w-5 h-5" /> },
  { id: "partners", href: "#partners", icon: <Handshake className="w-5 h-5" /> },
]

export function FloatingNav() {
  const { locale, setLocale, t } = useI18n()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("home")
  const [isExpanded, setIsExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)

      const sections = navItems.map((item) => item.href.replace("#", ""))
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      // If we're on the homepage, smooth scroll to section
      if (pathname === "/") {
        const element = document.getElementById(href.replace("#", ""))
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // If we're on a different page (like /admin), navigate to homepage with section
        window.location.href = `/${href}`
      }
    } else {
      // Navigate to external page
      window.location.href = href
    }
  }

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
        className={`bg-card/90 backdrop-blur-md border border-border rounded-2xl p-3 shadow-xl transition-all duration-300 ${scrolled ? "shadow-2xl" : ""
          }`}
        animate={{ width: isExpanded ? 200 : 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            // Check if this is a page route (starts with /) or a section (starts with #)
            const isPageRoute = item.href.startsWith("/")
            const isActive = isPageRoute
              ? pathname === item.href
              : pathname === "/" && activeSection === item.href.replace("#", "")

            return (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`flex items-center gap-3 p-1.25 rounded-xl transition-all duration-200 overflow-hidden ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {t(`nav.${item.id}`)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}

          {/* Divider */}
          <div className="h-px bg-border my-1" />

          {/* Admin Button */}
          <motion.button
            onClick={() => scrollToSection("/admin")}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 overflow-hidden ${pathname === "/admin"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
              }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: navItems.length * 0.1 }}
          >
            <div className="flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {t("nav.admin")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Settings Button */}
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 overflow-hidden ${showSettings ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"
              }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: navItems.length * 0.1 }}
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
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${locale === loc ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
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