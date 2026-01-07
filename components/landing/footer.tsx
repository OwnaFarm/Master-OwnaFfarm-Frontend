"use client"

import Image from "next/image"
import Link from "next/link"
import { Twitter, MessageCircle, Send } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t } = useI18n()

  const footerLinks = {
    product: [
      { labelKey: "hero.launchGame", href: "#" },
      { labelKey: "hero.registerFarm", href: "/register-farm" },
      { labelKey: "howItWorks.title", href: "#how-it-works" },
      { labelKey: "features.title", href: "#features" },
    ],
    company: [
      { labelKey: "footer.aboutUs", href: "#about" },
      { labelKey: "footer.careers", href: "#" },
      { labelKey: "footer.blog", href: "#" },
      { labelKey: "footer.contact", href: "#" },
    ],
    legal: [
      { labelKey: "footer.privacy", href: "#" },
      { labelKey: "footer.terms", href: "#" },
      { labelKey: "footer.cookies", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", href: "#", icon: <Twitter className="w-5 h-5" /> },
    { name: "Discord", href: "#", icon: <MessageCircle className="w-5 h-5" /> },
    { name: "Telegram", href: "#", icon: <Send className="w-5 h-5" /> },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/ownafarm-logo-green-leaf-modern.jpg"
                  alt="OwnaFarm Logo"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-xl font-bold text-foreground">OwnaFarm</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">{t("footer.description")}</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.labelKey}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.labelKey}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.labelKey}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">2026 OwnaFarm. {t("footer.rights")}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built on</span>
            <span className="font-semibold text-foreground">Mantle</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
