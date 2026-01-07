"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { BusinessInfoStep } from "./steps/business-info-step"
import { DocumentsStep } from "./steps/documents-step"
import { ReviewStep } from "./steps/review-step"
import { Check } from "lucide-react"
import { useI18n } from "@/lib/i18n"

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
  ktpPhoto: null,
  selfieWithKtp: null,
  npwpPhoto: null,
  bankStatement: null,
  landCertificate: null,
  businessLicense: null,
}

export function RegisterFarmForm() {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FarmerFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    { id: 1, name: t("registerFarm.steps.personalInfo") },
    { id: 2, name: t("registerFarm.steps.businessInfo") },
    { id: 3, name: t("registerFarm.steps.documents") },
    { id: 4, name: t("registerFarm.steps.review") },
  ]

  const updateFormData = (data: Partial<FarmerFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
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
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsComplete(true)
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
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
          {t("registerFarm.success.title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
          {t("registerFarm.success.description")}
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          {t("common.backToHome")}
        </a>
      </motion.div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Progress Steps - Responsive */}
      <div className="bg-muted/30 px-3 sm:px-6 py-4 sm:py-6 border-b border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-colors ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium hidden sm:block text-center max-w-[60px] sm:max-w-none ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-6 sm:w-12 md:w-16 lg:w-20 h-1 mx-1 sm:mx-2 rounded-full transition-colors ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

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
              <DocumentsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              key="step4"
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
