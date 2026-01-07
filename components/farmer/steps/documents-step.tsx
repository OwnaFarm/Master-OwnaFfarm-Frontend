"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, ImageIcon, Zap } from "lucide-react"
import { generateMockDocuments } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"
import type { FarmerFormData } from "../register-farm-form"

interface DocumentsStepProps {
  formData: FarmerFormData
  updateFormData: (data: Partial<FarmerFormData>) => void
  onNext: () => void
  onPrev: () => void
}

interface DocumentField {
  id: keyof FarmerFormData
  labelKey: string
  descKey: string
  required: boolean
  maxSize: number
  accept: string
}

const documents: DocumentField[] = [
  {
    id: "ktpPhoto",
    labelKey: "documents.ktpPhoto",
    descKey: "documents.ktpPhotoDesc",
    required: true,
    accept: "image/jpeg,image/png,application/pdf",
    maxSize: 5,
  },
  {
    id: "selfieWithKtp",
    labelKey: "documents.selfieWithKtp",
    descKey: "documents.selfieWithKtpDesc",
    required: true,
    accept: "image/jpeg,image/png",
    maxSize: 5,
  },
  {
    id: "npwpPhoto",
    labelKey: "documents.npwpPhoto",
    descKey: "documents.npwpPhotoDesc",
    required: true,
    accept: "image/jpeg,image/png,application/pdf",
    maxSize: 5,
  },
  {
    id: "bankStatement",
    labelKey: "documents.bankStatement",
    descKey: "documents.bankStatementDesc",
    required: false,
    accept: "application/pdf",
    maxSize: 10,
  },
  {
    id: "landCertificate",
    labelKey: "documents.landCertificate",
    descKey: "documents.landCertificateDesc",
    required: false,
    accept: "application/pdf",
    maxSize: 10,
  },
  {
    id: "businessLicense",
    labelKey: "documents.businessLicense",
    descKey: "documents.businessLicenseDesc",
    required: false,
    accept: "application/pdf",
    maxSize: 10,
  },
]

export function DocumentsStep({ formData, updateFormData, onNext, onPrev }: DocumentsStepProps) {
  const { t } = useI18n()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState<string | null>(null)

  const handleAutoFill = () => {
    const mockDocs = generateMockDocuments()
    updateFormData(mockDocs)
    setErrors({})
  }

  const handleDrag = useCallback((e: React.DragEvent, docId: string, entering: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(entering ? docId : null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, docId: keyof FarmerFormData, maxSize: number) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(null)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        if (file.size > maxSize * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, [docId]: `${t("documents.errors.fileSize")} ${maxSize}MB` }))
          return
        }
        setErrors((prev) => ({ ...prev, [docId]: "" }))
        updateFormData({ [docId]: file })
      }
    },
    [updateFormData, t],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docId: keyof FarmerFormData, maxSize: number) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [docId]: `${t("documents.errors.fileSize")} ${maxSize}MB` }))
        return
      }
      setErrors((prev) => ({ ...prev, [docId]: "" }))
      updateFormData({ [docId]: file })
    }
  }

  const removeFile = (docId: keyof FarmerFormData) => {
    updateFormData({ [docId]: null })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    documents.forEach((doc) => {
      if (doc.required && !formData[doc.id]) {
        newErrors[doc.id] = t("documents.errors.required")
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const getFileIcon = (file: File | null) => {
    if (!file) return null
    return file.type.startsWith("image/") ? (
      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
    ) : (
      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{t("documents.title")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t("documents.description")}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoFill}
          className="border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent self-start"
        >
          <Zap className="w-4 h-4 mr-2" />
          {t("documents.autoFill")}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {documents.map((doc) => {
          const file = formData[doc.id] as File | null
          return (
            <div key={doc.id} className="space-y-2">
              <Label className="text-sm">
                {t(doc.labelKey)} {doc.required && <span className="text-destructive">*</span>}
              </Label>
              {file ? (
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/50 border border-border rounded-xl">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(doc.id)}
                    className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={doc.id}
                  className={`flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    dragActive === doc.id
                      ? "border-primary bg-primary/5"
                      : errors[doc.id]
                        ? "border-destructive bg-destructive/5"
                        : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                  onDragEnter={(e) => handleDrag(e, doc.id, true)}
                  onDragLeave={(e) => handleDrag(e, doc.id, false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, doc.id, doc.maxSize)}
                >
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mb-2" />
                  <span className="text-xs sm:text-sm text-muted-foreground text-center">{t(doc.descKey)}</span>
                  <input
                    id={doc.id}
                    type="file"
                    accept={doc.accept}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, doc.id, doc.maxSize)}
                  />
                </label>
              )}
              {errors[doc.id] && <p className="text-xs text-destructive">{errors[doc.id]}</p>}
            </div>
          )
        })}
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
