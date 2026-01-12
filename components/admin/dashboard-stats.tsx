"use client"

import { ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react"
import type { FarmerSubmission } from "@/lib/dummy-data"

interface DashboardStatsProps {
    submissions: FarmerSubmission[]
}

export function DashboardStats({ submissions }: DashboardStatsProps) {
    const stats = {
        total: submissions.length,
        pending: submissions.filter((s) => s.status === "Pending").length,
        verified: submissions.filter((s) => s.status === "Verified").length,
        rejected: submissions.filter((s) => s.status === "Rejected").length,
    }

    const statCards = [
        {
            label: "Total Submissions",
            value: stats.total,
            icon: <ClipboardList className="w-6 h-6" />,
            color: "text-foreground",
            bgColor: "bg-muted",
        },
        {
            label: "Pending Review",
            value: stats.pending,
            icon: <Clock className="w-6 h-6" />,
            color: "text-secondary-foreground",
            bgColor: "bg-secondary",
        },
        {
            label: "Verified",
            value: stats.verified,
            icon: <CheckCircle2 className="w-6 h-6" />,
            color: "text-primary-foreground",
            bgColor: "bg-primary",
        },
        {
            label: "Rejected",
            value: stats.rejected,
            icon: <XCircle className="w-6 h-6" />,
            color: "text-destructive-foreground",
            bgColor: "bg-destructive",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <div
                    key={stat.label}
                    className="pixel-border bg-card p-6 rounded-lg hover-scale transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
                        <span className="text-4xl font-bold font-pixel text-foreground">{stat.value}</span>
                    </div>
                    <p className="text-xs font-pixel text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
            ))}
        </div>
    )
}
