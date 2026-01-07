"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Zap } from "lucide-react"
import { generatePersonalInfo } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import type { FarmerFormData } from "../register-farm-form"

interface PersonalInfoStepProps {
  formData: FarmerFormData
  updateFormData: (data: Partial<FarmerFormData>) => void
  onNext: () => void
}

const provinces = [
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Banten",
  "DKI Jakarta",
  "Sumatera Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Bali",
  "Kalimantan Barat",
  "Kalimantan Timur",
  "Sulawesi Selatan",
]

export function PersonalInfoStep({ formData, updateFormData, onNext }: PersonalInfoStepProps) {
  const { t } = useI18n()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAutoFill = () => {
    const mockData = generatePersonalInfo()
    updateFormData(mockData)
    setErrors({})
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = t("personalInfo.errors.fullName")
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("personalInfo.errors.email")
    }
    if (!formData.phoneNumber || !/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t("personalInfo.errors.phoneNumber")
    }
    if (!formData.idNumber || formData.idNumber.length !== 16) {
      newErrors.idNumber = t("personalInfo.errors.idNumber")
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t("personalInfo.errors.dateOfBirth")
    }
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = t("personalInfo.errors.address")
    }
    if (!formData.province) {
      newErrors.province = t("personalInfo.errors.province")
    }
    if (!formData.city) {
      newErrors.city = t("personalInfo.errors.city")
    }
    if (!formData.district) {
      newErrors.district = t("personalInfo.errors.district")
    }
    if (!formData.postalCode || formData.postalCode.length !== 5) {
      newErrors.postalCode = t("personalInfo.errors.postalCode")
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{t("personalInfo.title")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t("personalInfo.description")}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoFill}
          className="border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent self-start"
        >
          <Zap className="w-4 h-4 mr-2" />
          {t("personalInfo.autoFill")}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm">
            {t("personalInfo.fullName")} *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className={`text-sm ${errors.fullName ? "border-destructive" : ""}`}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">
            {t("personalInfo.email")} *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`text-sm ${errors.email ? "border-destructive" : ""}`}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm">
            {t("personalInfo.phoneNumber")} *
          </Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData({ phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
            placeholder="+62 812 3456 7890"
            className={`text-sm ${errors.phoneNumber ? "border-destructive" : ""}`}
          />
          {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber" className="text-sm">
            {t("personalInfo.idNumber")} *
          </Label>
          <Input
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => updateFormData({ idNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
            placeholder="16 digit NIK"
            className={`text-sm ${errors.idNumber ? "border-destructive" : ""}`}
          />
          {errors.idNumber && <p className="text-xs text-destructive">{errors.idNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-sm">
            {t("personalInfo.dateOfBirth")} *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
            className={`text-sm ${errors.dateOfBirth ? "border-destructive" : ""}`}
          />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="province" className="text-sm">
            {t("personalInfo.province")} *
          </Label>
          <Select value={formData.province} onValueChange={(value) => updateFormData({ province: value })}>
            <SelectTrigger className={`text-sm ${errors.province ? "border-destructive" : ""}`}>
              <SelectValue placeholder={t("personalInfo.selectProvince")} />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.province && <p className="text-xs text-destructive">{errors.province}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm">
            {t("personalInfo.city")} *
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className={`text-sm ${errors.city ? "border-destructive" : ""}`}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm">
            {t("personalInfo.district")} *
          </Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => updateFormData({ district: e.target.value })}
            className={`text-sm ${errors.district ? "border-destructive" : ""}`}
          />
          {errors.district && <p className="text-xs text-destructive">{errors.district}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm">
            {t("personalInfo.postalCode")} *
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateFormData({ postalCode: e.target.value.replace(/\D/g, "").slice(0, 5) })}
            placeholder="5 digit"
            className={`text-sm ${errors.postalCode ? "border-destructive" : ""}`}
          />
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm">
          {t("personalInfo.address")} *
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => updateFormData({ address: e.target.value })}
          rows={3}
          className={`text-sm ${errors.address ? "border-destructive" : ""}`}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>

      <div className="flex justify-end pt-2 sm:pt-4">
        <Button onClick={handleNext} className="px-6 sm:px-8">
          {t("common.continue")}
        </Button>
      </div>
    </div>
  )
}
