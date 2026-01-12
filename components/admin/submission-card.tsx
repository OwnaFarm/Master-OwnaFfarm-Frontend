"use client"

import { MapPin, Mail, Phone, Calendar, Briefcase, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FarmerSubmission } from "@/lib/dummy-data"

interface SubmissionCardProps {
    submission: FarmerSubmission
    onApprove: (id: string) => void
    onReject: (id: string) => void
}

export function SubmissionCard({ submission, onApprove, onReject }: SubmissionCardProps) {
    const getStatusBadge = () => {
        switch (submission.status) {
            case "Verified":
                return (
                    <Badge className="bg-primary text-primary-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg">
                        ✓ VERIFIED
                    </Badge>
                )
            case "Rejected":
                return (
                    <Badge className="bg-destructive text-destructive-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg">
                        ✗ REJECTED
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-secondary text-secondary-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg animate-pulse-cta">
                        ⏳ PENDING
                    </Badge>
                )
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div className="pixel-border bg-card p-6 rounded-lg hover-scale transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-pixel text-sm text-foreground mb-2">{submission.farmerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{submission.businessType}</span>
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            {/* Description */}
            <p className="text-sm text-foreground mb-4 line-clamp-3">{submission.description}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{submission.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground truncate">{submission.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{submission.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Sprout className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                        {submission.landSize} • {submission.experience} exp
                    </span>
                </div>
            </div>

            {/* Submission Date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 border-t border-border pt-3">
                <Calendar className="w-3 h-3" />
                <span>Submitted: {formatDate(submission.submittedAt)}</span>
                {submission.reviewedAt && <span>• Reviewed: {formatDate(submission.reviewedAt)}</span>}
            </div>

            {/* Action Buttons */}
            {submission.status === "Pending" && (
                <div className="flex gap-3">
                    <Button
                        onClick={() => onApprove(submission.id)}
                        className="flex-1 pixel-button bg-primary text-primary-foreground hover:bg-primary/90 font-pixel text-xs rounded-md uppercase tracking-wider"
                    >
                        ✓ APPROVE
                    </Button>
                    <Button
                        onClick={() => onReject(submission.id)}
                        variant="destructive"
                        className="flex-1 pixel-button font-pixel text-xs rounded-md uppercase tracking-wider"
                    >
                        ✗ REJECT
                    </Button>
                </div>
            )}

            {submission.status !== "Pending" && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                    This submission has been {submission.status.toLowerCase()}
                </div>
            )}
        </div>
    )
}
