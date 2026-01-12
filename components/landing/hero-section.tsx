"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2, Tractor } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useState, useEffect } from "react"

export function HeroSection() {
  const { t } = useI18n()
  const [displayedText, setDisplayedText] = useState("")
  const fullText = t("hero.title1")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Track if component is mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Typewriter effect for headline
  useEffect(() => {
    if (fullText.length === 0) return

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, 80) // 80ms per character for smooth typing

    return () => clearInterval(typingInterval)
  }, [fullText])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/beautiful-green-rice-paddy-field-aerial-view-sunri.jpg"
          alt="Agricultural landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Parallax Clouds - Slow moving background layer */}
      {isMounted && (
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute text-6xl opacity-20"
              initial={{
                x: -100,
                y: Math.random() * 80 + 10 + '%',
              }}
              animate={{
                x: '100vw',
              }}
              transition={{
                duration: 40 + (i * 5), // Varying speeds for depth
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 5,
              }}
            >
              ☁️
            </motion.div>
          ))}

          {/* Floating particles for extra depth */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-primary/10 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: '100%',
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: '-10%',
                x: `${parseFloat(Math.random() * 100 + '%') + (Math.random() * 10 - 5)}%`,
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 1.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <Tractor className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{t("hero.badge")}</span>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-pixel text-foreground leading-tight mb-6">
              <span className="inline-block">
                {displayedText}
                {!isTypingComplete && <span className="inline-block w-1 h-10 md:h-12 lg:h-14 bg-primary ml-1 animate-pulse" />}
              </span>
              <br />
              <span className="text-primary">{t("hero.title2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="pixel-button animate-pulse-cta bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-pixel uppercase rounded-md shadow-lg"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                {t("hero.launchGame")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="pixel-button bg-secondary hover:bg-secondary/90 text-secondary-foreground border-0 px-8 py-6 text-lg font-pixel uppercase rounded-md shadow-lg"
              >
                <Link href="/register-farm">
                  <Tractor className="w-5 h-5 mr-2" />
                  {t("hero.registerFarm")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/isometric-farm-game-illustration-with-green-crops-.jpg"
                  alt="Farm Game Illustration"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-2xl"
                />

                {/* Floating Stats Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 pixel-border bg-card rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-pixel text-xs">%</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-pixel">{t("hero.apy")}</p>
                      <p className="text-lg font-pixel text-primary">12-25%</p>
                    </div>
                  </div>

                  {/* Floating coins/leaves around the APY card */}
                  {isMounted && [...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      initial={{
                        x: Math.random() * 40 - 20,
                        y: 0,
                        opacity: 0.8
                      }}
                      animate={{
                        y: -100,
                        x: (Math.random() * 40 - 20) + (Math.random() * 20),
                        opacity: 0
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.6,
                        ease: "easeOut"
                      }}
                      style={{
                        bottom: '0px',
                        left: '50%',
                      }}
                    >
                      {i % 2 === 0 ? '🪙' : '🍃'}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 pixel-border bg-card rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-pixel text-xs">+</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-pixel">{t("hero.farmers")}</p>
                      <p className="text-lg font-pixel text-secondary">500+</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-8 h-12 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
