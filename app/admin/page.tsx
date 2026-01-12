"use client"

import { useState } from "react"
import { FloatingNav } from "@/components/landing/floating-nav"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Footer } from "@/components/landing/footer"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { SubmissionCard } from "@/components/admin/submission-card"
import { dummySubmissions, type FarmerSubmission } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<FarmerSubmission[]>(dummySubmissions)
    const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Verified" | "Rejected">("All")

    const handleApprove = (id: string) => {
        setSubmissions((prev) =>
            prev.map((sub) =>
                sub.id === id
                    ? {
                        ...sub,
                        status: "Verified" as const,
                        reviewedAt: new Date(),
                    }
                    : sub,
            ),
        )
    }

    const handleReject = (id: string) => {
        setSubmissions((prev) =>
            prev.map((sub) =>
                sub.id === id
                    ? {
                        ...sub,
                        status: "Rejected" as const,
                        reviewedAt: new Date(),
                    }
                    : sub,
            ),
        )
    }

    const filteredSubmissions =
        filterStatus === "All" ? submissions : submissions.filter((sub) => sub.status === filterStatus)

    return (
        <main className="min-h-screen bg-background">
            <FloatingNav />
            <MobileNav />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block pixel-border bg-primary/10 px-8 py-6 mb-6 rounded-full">
                            <h1 className="font-pixel text-2xl md:text-3xl lg:text-4xl text-primary uppercase tracking-wide">
                                🎮 ADMIN DASHBOARD 🎮
                            </h1>
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Review and manage farmer business proposals. Approve promising ventures or reject submissions that don't
                            meet criteria.
                        </p>
                    </div>

                    {/* Statistics */}
                    <DashboardStats submissions={submissions} />

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        <div className="flex items-center gap-2 text-foreground pixel-border bg-card px-4 py-2 rounded-lg">
                            <Filter className="w-4 h-4" />
                            <span className="font-pixel text-xs uppercase">Filter:</span>
                        </div>
                        {["All", "Pending", "Verified", "Rejected"].map((status) => (
                            <Button
                                key={status}
                                onClick={() => setFilterStatus(status as typeof filterStatus)}
                                variant={filterStatus === status ? "default" : "outline"}
                                className={`pixel-button font-pixel text-xs uppercase tracking-wider rounded-md ${filterStatus === status
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card text-foreground hover:bg-muted"
                                    }`}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>

                    {/* Submissions Table */}
                    {filteredSubmissions.length > 0 ? (
                        <div className="pixel-border bg-card rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b border-border">
                                            <th className="text-left p-4 font-pixel text-xs uppercase text-foreground">Farmer</th>
                                            <th className="text-left p-4 font-pixel text-xs uppercase text-foreground">Business</th>
                                            <th className="text-left p-4 font-pixel text-xs uppercase text-foreground hidden md:table-cell">Location</th>
                                            <th className="text-left p-4 font-pixel text-xs uppercase text-foreground hidden lg:table-cell">Experience</th>
                                            <th className="text-left p-4 font-pixel text-xs uppercase text-foreground">Status</th>
                                            <th className="text-center p-4 font-pixel text-xs uppercase text-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSubmissions.map((submission, index) => (
                                            <tr
                                                key={submission.id}
                                                className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                                                    }`}
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-semibold text-base text-foreground mb-1">{submission.farmerName}</p>
                                                        <p className="text-xs text-muted-foreground">{submission.email}</p>
                                                        <p className="text-xs text-muted-foreground">{submission.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-sm text-foreground mb-1">{submission.businessType}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">{submission.description}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 hidden md:table-cell">
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>{submission.location.district}</p>
                                                        <p>{submission.location.city}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 hidden lg:table-cell">
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>{submission.yearsOfExperience} years</p>
                                                        <p>{submission.landSize} hectares</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {submission.status === "Verified" && (
                                                        <span className="inline-block bg-primary text-primary-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg">
                                                            ✓ VERIFIED
                                                        </span>
                                                    )}
                                                    {submission.status === "Rejected" && (
                                                        <span className="inline-block bg-destructive text-destructive-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg">
                                                            ✗ REJECTED
                                                        </span>
                                                    )}
                                                    {submission.status === "Pending" && (
                                                        <span className="inline-block bg-secondary text-secondary-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg animate-pulse-cta">
                                                            ⏳ PENDING
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {submission.status === "Pending" ? (
                                                        <div className="flex gap-2 justify-center">
                                                            <Button
                                                                onClick={() => handleApprove(submission.id)}
                                                                size="sm"
                                                                className="pixel-button bg-primary text-primary-foreground hover:bg-primary/90 font-pixel text-[10px] rounded-md px-3 py-1"
                                                            >
                                                                ✓
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleReject(submission.id)}
                                                                size="sm"
                                                                variant="destructive"
                                                                className="pixel-button font-pixel text-[10px] rounded-md px-3 py-1"
                                                            >
                                                                ✗
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-xs text-muted-foreground">
                                                            {submission.status}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="pixel-border bg-card p-12 text-center rounded-lg">
                            <p className="font-pixel text-xs text-muted-foreground uppercase tracking-wide mb-2">⚠️ NO RESULTS ⚠️</p>
                            <p className="text-muted-foreground text-sm">No submissions found with status: {filterStatus}</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
