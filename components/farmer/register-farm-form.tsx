"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { BusinessInfoStep } from "./steps/business-info-step"
import { DocumentsStep } from "./steps/documents-step"
import { InvestmentStep } from "./steps/investment-step"
import { ReviewStep } from "./steps/review-step"
import { Check, Loader2, ExternalLink } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { registerFarmer, ApiError } from "@/lib/api"
import { useSubmitInvoice, generateOfftakerId } from "@/hooks/use-submit-invoice"
import { parseUnits } from "viem"
import { useWallets } from "@privy-io/react-auth"

export interface FarmerFormData {
  // Personal Info
  fullName: string
  email: string
  phoneNumber: string
  idNumber: string
  dateOfBirth: string
  address: string
  province: string
  city: string
  district: string
  postalCode: string
  // Business Info
  businessName: string
  businessType: string
  npwp: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  yearsOfExperience: string
  cropsExpertise: string[]
  // Investment Info (for NFT)
  targetFund: string
  yieldBps: string
  duration: string
  // Documents
  ktpPhoto: File | null
  selfieWithKtp: File | null
  npwpPhoto: File | null
  bankStatement: File | null
  landCertificate: File | null
  businessLicense: File | null
}

const initialFormData: FarmerFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  idNumber: "",
  dateOfBirth: "",
  address: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  businessName: "",
  businessType: "",
  npwp: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountName: "",
  yearsOfExperience: "",
  cropsExpertise: [],
  targetFund: "",
  yieldBps: "",
  duration: "",
  ktpPhoto: null,
  selfieWithKtp: null,
  npwpPhoto: null,
  bankStatement: null,
  landCertificate: null,
  businessLicense: null,
}

interface SubmitStatus {
  step: 'idle' | 'backend' | 'nft' | 'complete' | 'error'
  message: string
  txHash?: string
  tokenId?: string
}

export function RegisterFarmForm() {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FarmerFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ step: 'idle', message: '' })

  const { submitInvoice } = useSubmitInvoice()
  const { wallets } = useWallets()

  const steps = [
    { id: 1, name: t("registerFarm.steps.personalInfo") },
    { id: 2, name: t("registerFarm.steps.businessInfo") },
    { id: 3, name: "Investment" },
    { id: 4, name: t("registerFarm.steps.documents") },
    { id: 5, name: t("registerFarm.steps.review") },
  ]

  const updateFormData = (data: Partial<FarmerFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus({ step: 'backend', message: 'Submitting registration to backend...' })

    try {
      // Step 1: Register with backend
      const response = await registerFarmer(formData)

      if (!response.success) {
        throw new Error(response.message || 'Registration failed')
      }

      // Step 2: Switch to Mantle Sepolia using Privy wallet
      setSubmitStatus({ step: 'nft', message: 'Switching to Mantle Sepolia network...' })

      const wallet = wallets[0]
      if (wallet) {
        try {
          await wallet.switchChain(5003) // Mantle Sepolia chain ID
        } catch (switchErr) {
          console.log('Chain switch attempt:', switchErr)
          // Continue anyway, the wagmi hook will try to switch
        }
      }

      // Step 3: Mint NFT on blockchain
      setSubmitStatus({ step: 'nft', message: 'Please confirm transaction in your wallet...' })

      // Generate offtakerId from farmer email + timestamp
      const offtakerId = generateOfftakerId(formData.email, Date.now())

      // Convert targetFund to wei (18 decimals for GOLD token)
      const targetFundWei = parseUnits(formData.targetFund, 18)

      const nftResult = await submitInvoice({
        offtakerId,
        targetFund: targetFundWei,
        yieldBps: parseInt(formData.yieldBps),
        duration: parseInt(formData.duration),
      })

      setSubmitStatus({
        step: 'complete',
        message: 'NFT minted successfully!',
        txHash: nftResult.txHash,
        tokenId: nftResult.tokenId.toString()
      })

      setIsComplete(true)
    } catch (error) {
      console.error("Registration error:", error)

      let errorMessage = t("registerFarm.error.generic")

      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          errorMessage = "You are already registered. Please contact support if you need assistance."
        } else if (error.statusCode === 400) {
          errorMessage = t("registerFarm.error.validation")
        } else if (error.statusCode === 500) {
          errorMessage = t("registerFarm.error.server")
        } else if (error.message) {
          errorMessage = error.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setSubmitStatus({ step: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-pixel text-foreground mb-3 sm:mb-4">
          {t("registerFarm.success.title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
          {t("registerFarm.success.description")}
        </p>

        {submitStatus.tokenId && (
          <div className="pixel-border bg-primary/10 p-4 rounded-lg mb-6 max-w-sm mx-auto">
            <p className="font-pixel text-sm text-primary mb-2">🎉 NFT Token #{submitStatus.tokenId}</p>
            <p className="text-xs text-muted-foreground">
              Your farm investment is now available for investors!
            </p>
            {submitStatus.txHash && (
              <a
                href={`https://sepolia.mantlescan.xyz/tx/${submitStatus.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mt-2"
              >
                View Transaction <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        <a
          href="/"
          className="pixel-button inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-md font-pixel uppercase hover:bg-primary/90 text-sm sm:text-base"
        >
          {t("common.backToHome")}
        </a>
      </motion.div>
    )
  }

  return (
    <div className="pixel-border bg-card rounded-lg overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-muted/30 px-3 sm:px-6 py-4 sm:py-6 border-b border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-colors ${currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-pixel hidden sm:block text-center max-w-[60px] sm:max-w-none ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-4 sm:w-8 md:w-12 lg:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Status Banner */}
      {isSubmitting && (
        <div className="bg-primary/10 px-4 py-3 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-foreground">{submitStatus.message}</span>
        </div>
      )}

      {/* Error Banner */}
      {submitStatus.step === 'error' && !isSubmitting && (
        <div className="bg-destructive/10 px-4 py-3 text-center">
          <span className="text-sm text-destructive">{submitStatus.message}</span>
        </div>
      )}

      {/* Form Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PersonalInfoStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BusinessInfoStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <InvestmentStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DocumentsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReviewStep formData={formData} onPrev={prevStep} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
