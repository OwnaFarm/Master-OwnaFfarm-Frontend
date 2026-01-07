"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

import idLocale from "@/locales/id.json"
import enLocale from "@/locales/en.json"
import zhLocale from "@/locales/zh.json"

type Locale = "id" | "en" | "zh"

type LocaleData = typeof idLocale

const locales: Record<Locale, LocaleData> = {
  id: idLocale,
  en: enLocale,
  zh: zhLocale,
}

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
  zh: "中文",
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id")

  useEffect(() => {
    const saved = localStorage.getItem("ownafarm-locale") as Locale | null
    if (saved && locales[saved]) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("ownafarm-locale", newLocale)
  }, [])

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".")
      let result: unknown = locales[locale]

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = (result as Record<string, unknown>)[k]
        } else {
          return key
        }
      }

      return typeof result === "string" ? result : key
    },
    [locale],
  )

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
