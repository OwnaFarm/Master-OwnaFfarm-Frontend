import { FloatingNav } from "@/components/landing/floating-nav"
import { MobileNav } from "@/components/landing/mobile-nav"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { AboutSection } from "@/components/landing/about-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { PartnersSection } from "@/components/landing/partners-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <FloatingNav />
      <MobileNav />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PartnersSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
