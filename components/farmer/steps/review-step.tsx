"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { User, Briefcase, FileText, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { FarmerFormData } from "../register-farm-form"

interface ReviewStepProps {
  formData: FarmerFormData
  onPrev: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ReviewStep({ formData, onPrev, onSubmit, isSubmitting }: ReviewStepProps) {
  const { t } = useI18n()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!agreedToTerms) {
      setError(t("review.errors.terms"))
      return
    }
    setError("")
    onSubmit()
  }

  const personalFields = [
    { label: t("personalInfo.fullName"), value: formData.fullName },
    { label: t("personalInfo.email"), value: formData.email },
    { label: t("personalInfo.phoneNumber"), value: formData.phoneNumber },
    { label: t("personalInfo.idNumber"), value: formData.idNumber },
    { label: t("personalInfo.dateOfBirth"), value: formData.dateOfBirth },
    { label: t("personalInfo.province"), value: formData.province },
    { label: t("personalInfo.city"), value: formData.city },
    { label: t("personalInfo.district"), value: formData.district },
    { label: t("personalInfo.postalCode"), value: formData.postalCode },
  ]

  const businessFields = [
    { label: t("businessInfo.businessType"), value: formData.businessType },
    { label: t("businessInfo.businessName"), value: formData.businessName || "-" },
    { label: t("businessInfo.npwp"), value: formData.npwp },
    { label: t("businessInfo.bankName"), value: formData.bankName },
    { label: t("businessInfo.bankAccountNumber"), value: formData.bankAccountNumber },
    { label: t("businessInfo.bankAccountName"), value: formData.bankAccountName },
    { label: t("businessInfo.yearsOfExperience"), value: `${formData.yearsOfExperience} ${t("review.years")}` },
    { label: t("businessInfo.cropsExpertise"), value: formData.cropsExpertise.join(", ") },
  ]

  const documentFields = [
    { label: t("documents.ktpPhoto"), value: formData.ktpPhoto?.name || t("review.notUploaded") },
    { label: t("documents.selfieWithKtp"), value: formData.selfieWithKtp?.name || t("review.notUploaded") },
    { label: t("documents.npwpPhoto"), value: formData.npwpPhoto?.name || t("review.notUploaded") },
    { label: t("documents.bankStatement"), value: formData.bankStatement?.name || t("review.notUploaded") },
    { label: t("documents.landCertificate"), value: formData.landCertificate?.name || t("review.notUploaded") },
    { label: t("documents.businessLicense"), value: formData.businessLicense?.name || t("review.notUploaded") },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{t("review.title")}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{t("review.description")}</p>
      </div>

      {/* Personal Info Section */}
      <div className="bg-muted/30 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("review.personalSection")}</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {personalFields.map((field) => (
            <div key={field.label}>
              <p className="text-xs sm:text-sm text-muted-foreground">{field.label}</p>
              <p className="text-sm sm:text-base font-medium text-foreground">{field.value}</p>
            </div>
          ))}
          <div className="sm:col-span-2">
            <p className="text-xs sm:text-sm text-muted-foreground">{t("personalInfo.address")}</p>
            <p className="text-sm sm:text-base font-medium text-foreground">{formData.address}</p>
          </div>
        </div>
      </div>

      {/* Business Info Section */}
      <div className="bg-muted/30 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("review.businessSection")}</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {businessFields.map((field) => (
            <div key={field.label}>
              <p className="text-xs sm:text-sm text-muted-foreground">{field.label}</p>
              <p className="text-sm sm:text-base font-medium text-foreground">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-muted/30 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("review.documentsSection")}</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {documentFields.map((field) => (
            <div key={field.label}>
              <p className="text-xs sm:text-sm text-muted-foreground">{field.label}</p>
              <p
                className={`text-sm sm:text-base font-medium ${field.value === t("review.notUploaded") ? "text-muted-foreground" : "text-foreground"}`}
              >
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => {
              setAgreedToTerms(checked as boolean)
              if (checked) setError("")
            }}
          />
          <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed cursor-pointer">
            {t("review.termsAgreement")}
          </Label>
        </div>
        {error && <p className="text-xs sm:text-sm text-destructive mt-2">{error}</p>}
      </div>

      <div className="flex justify-between pt-2 sm:pt-4">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          {t("common.back")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="px-6 sm:px-8">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("common.submitting")}
            </>
          ) : (
            t("review.submitRegistration")
          )}
        </Button>
      </div>
    </div>
  )
}
