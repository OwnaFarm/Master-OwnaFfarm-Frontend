"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Coins, Calendar, Percent } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface InvestmentStepProps {
    formData: {
        targetFund: string
        yieldBps: string
        duration: string
    }
    updateFormData: (data: { targetFund?: string; yieldBps?: string; duration?: string }) => void
    onNext: () => void
    onPrev: () => void
}

const durationOptions = [
    { value: "2592000", label: "1 Month (30 days)" },
    { value: "5184000", label: "2 Months (60 days)" },
    { value: "7776000", label: "3 Months (90 days)" },
    { value: "15552000", label: "6 Months (180 days)" },
    { value: "31536000", label: "1 Year (365 days)" },
]

const yieldOptions = [
    { value: "300", label: "3%" },
    { value: "500", label: "5%" },
    { value: "700", label: "7%" },
    { value: "1000", label: "10%" },
    { value: "1200", label: "12%" },
    { value: "1500", label: "15%" },
]

export function InvestmentStep({ formData, updateFormData, onNext, onPrev }: InvestmentStepProps) {
    const { t } = useI18n()
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.targetFund || parseFloat(formData.targetFund) <= 0) {
            newErrors.targetFund = "Target fund is required and must be greater than 0"
        }
        if (!formData.yieldBps) {
            newErrors.yieldBps = "Please select expected yield"
        }
        if (!formData.duration) {
            newErrors.duration = "Please select investment duration"
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
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-pixel text-foreground mb-2">Investment Details</h2>
                <p className="text-sm text-muted-foreground">
                    Set up your farm investment NFT for investors
                </p>
            </div>

            <div className="grid gap-6">
                {/* Target Fund */}
                <div className="space-y-2">
                    <Label htmlFor="targetFund" className="flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        Target Investment (GOLD)
                    </Label>
                    <Input
                        id="targetFund"
                        type="number"
                        placeholder="e.g. 10000"
                        value={formData.targetFund}
                        onChange={(e) => updateFormData({ targetFund: e.target.value })}
                        className={errors.targetFund ? "border-destructive" : ""}
                    />
                    {errors.targetFund && (
                        <p className="text-xs text-destructive">{errors.targetFund}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Total investment amount you need from investors (in GOLD tokens)
                    </p>
                </div>

                {/* Expected Yield */}
                <div className="space-y-2">
                    <Label htmlFor="yieldBps" className="flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        Expected Yield
                    </Label>
                    <Select
                        value={formData.yieldBps}
                        onValueChange={(value) => updateFormData({ yieldBps: value })}
                    >
                        <SelectTrigger className={errors.yieldBps ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select expected yield" />
                        </SelectTrigger>
                        <SelectContent>
                            {yieldOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.yieldBps && (
                        <p className="text-xs text-destructive">{errors.yieldBps}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Annual percentage yield investors will receive
                    </p>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Investment Duration
                    </Label>
                    <Select
                        value={formData.duration}
                        onValueChange={(value) => updateFormData({ duration: value })}
                    >
                        <SelectTrigger className={errors.duration ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            {durationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.duration && (
                        <p className="text-xs text-destructive">{errors.duration}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        How long investors' funds will be locked
                    </p>
                </div>
            </div>

            {/* Info Card */}
            <div className="pixel-border bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-2">⚡ NFT Investment Token</p>
                <p className="text-xs text-muted-foreground">
                    After registration, an NFT will be minted on the blockchain.
                    Investors can then invest in your farm by purchasing shares of this NFT.
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrev}
                    className="pixel-button flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handleNext}
                    className="pixel-button bg-primary text-primary-foreground flex items-center gap-2"
                >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
