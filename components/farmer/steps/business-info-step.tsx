"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap } from "lucide-react"
import { generateBusinessInfo } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import type { FarmerFormData } from "../register-farm-form"

interface BusinessInfoStepProps {
  formData: FarmerFormData
  updateFormData: (data: Partial<FarmerFormData>) => void
  onNext: () => void
  onPrev: () => void
}


const businessTypes = [
  { value: "individual", label: "Individual" },
  { value: "cv", label: "CV" },
  { value: "pt", label: "PT" },
  { value: "ud", label: "UD (Usaha Dagang)" },
  { value: "cooperative", label: "Koperasi" }
]
const banks = ["BCA", "BRI", "BNI", "Mandiri", "CIMB Niaga", "Bank Jago", "Bank Danamon", "Bank Permata"]
const cropOptions = [
  "Padi (Rice)",
  "Jagung (Corn)",
  "Cabai (Chili)",
  "Tomat (Tomato)",
  "Bawang Merah (Shallot)",
  "Bawang Putih (Garlic)",
  "Kentang (Potato)",
  "Wortel (Carrot)",
  "Kopi (Coffee)",
  "Kelapa Sawit (Palm Oil)",
]

export function BusinessInfoStep({ formData, updateFormData, onNext, onPrev }: BusinessInfoStepProps) {
  const { t } = useI18n()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleCropChange = (crop: string, checked: boolean) => {
    const currentCrops = formData.cropsExpertise
    if (checked) {
      updateFormData({ cropsExpertise: [...currentCrops, crop] })
    } else {
      updateFormData({ cropsExpertise: currentCrops.filter((c) => c !== crop) })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.businessType) {
      newErrors.businessType = t("businessInfo.errors.businessType")
    }
    if (!formData.npwp || formData.npwp.length < 15) {
      newErrors.npwp = t("businessInfo.errors.npwp")
    }
    if (!formData.bankName) {
      newErrors.bankName = t("businessInfo.errors.bankName")
    }
    if (!formData.bankAccountNumber || formData.bankAccountNumber.length < 10) {
      newErrors.bankAccountNumber = t("businessInfo.errors.bankAccountNumber")
    }
    if (!formData.bankAccountName) {
      newErrors.bankAccountName = t("businessInfo.errors.bankAccountName")
    }
    if (!formData.yearsOfExperience || Number.parseInt(formData.yearsOfExperience) < 1) {
      newErrors.yearsOfExperience = t("businessInfo.errors.yearsOfExperience")
    }
    if (formData.cropsExpertise.length === 0) {
      newErrors.cropsExpertise = t("businessInfo.errors.cropsExpertise")
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const handleAutoFill = () => {
    const mockData = generateBusinessInfo()
    updateFormData(mockData)
    setErrors({})
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{t("businessInfo.title")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t("businessInfo.description")}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoFill}
          className="border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent self-start"
        >
          <Zap className="w-4 h-4 mr-2" />
          {t("businessInfo.autoFill")}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessType" className="text-sm">
            {t("businessInfo.businessType")} *
          </Label>
          <Select value={formData.businessType} onValueChange={(value) => updateFormData({ businessType: value })}>
            <SelectTrigger className={`text-sm ${errors.businessType ? "border-destructive" : ""}`}>
              <SelectValue placeholder={t("businessInfo.selectBusinessType")} />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && <p className="text-xs text-destructive">{errors.businessType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm">
            {t("businessInfo.businessName")}
          </Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => updateFormData({ businessName: e.target.value })}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="npwp" className="text-sm">
            {t("businessInfo.npwp")} *
          </Label>
          <Input
            id="npwp"
            value={formData.npwp}
            onChange={(e) => updateFormData({ npwp: e.target.value.replace(/\D/g, "").slice(0, 15) })}
            placeholder="15 digit NPWP"
            className={`text-sm ${errors.npwp ? "border-destructive" : ""}`}
          />
          {errors.npwp && <p className="text-xs text-destructive">{errors.npwp}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience" className="text-sm">
            {t("businessInfo.yearsOfExperience")} *
          </Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="1"
            value={formData.yearsOfExperience}
            onChange={(e) => updateFormData({ yearsOfExperience: e.target.value })}
            placeholder="e.g., 5"
            className={`text-sm ${errors.yearsOfExperience ? "border-destructive" : ""}`}
          />
          {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName" className="text-sm">
            {t("businessInfo.bankName")} *
          </Label>
          <Select value={formData.bankName} onValueChange={(value) => updateFormData({ bankName: value })}>
            <SelectTrigger className={`text-sm ${errors.bankName ? "border-destructive" : ""}`}>
              <SelectValue placeholder={t("businessInfo.selectBank")} />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bankName && <p className="text-xs text-destructive">{errors.bankName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankAccountNumber" className="text-sm">
            {t("businessInfo.bankAccountNumber")} *
          </Label>
          <Input
            id="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={(e) => updateFormData({ bankAccountNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
            className={`text-sm ${errors.bankAccountNumber ? "border-destructive" : ""}`}
          />
          {errors.bankAccountNumber && <p className="text-xs text-destructive">{errors.bankAccountNumber}</p>}
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="bankAccountName" className="text-sm">
            {t("businessInfo.bankAccountName")} *
          </Label>
          <Input
            id="bankAccountName"
            value={formData.bankAccountName}
            onChange={(e) => updateFormData({ bankAccountName: e.target.value })}
            className={`text-sm ${errors.bankAccountName ? "border-destructive" : ""}`}
          />
          {errors.bankAccountName && <p className="text-xs text-destructive">{errors.bankAccountName}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm">{t("businessInfo.cropsExpertise")} *</Label>
        <p className="text-xs sm:text-sm text-muted-foreground">{t("businessInfo.cropsDescription")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {cropOptions.map((crop) => (
            <div key={crop} className="flex items-center space-x-2">
              <Checkbox
                id={crop}
                checked={formData.cropsExpertise.includes(crop)}
                onCheckedChange={(checked) => handleCropChange(crop, checked as boolean)}
              />
              <Label htmlFor={crop} className="text-xs sm:text-sm font-normal cursor-pointer">
                {crop}
              </Label>
            </div>
          ))}
        </div>
        {errors.cropsExpertise && <p className="text-xs text-destructive">{errors.cropsExpertise}</p>}
      </div>

      <div className="flex justify-between pt-2 sm:pt-4">
        <Button variant="outline" onClick={onPrev}>
          {t("common.back")}
        </Button>
        <Button onClick={handleNext} className="px-6 sm:px-8">
          {t("common.continue")}
        </Button>
      </div>
    </div>
  )
}
