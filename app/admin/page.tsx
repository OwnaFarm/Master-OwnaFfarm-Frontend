"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { FloatingNav } from "@/components/landing/floating-nav"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Footer } from "@/components/landing/footer"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"
import { Filter, RefreshCw, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { getFarmers, approveFarmer, rejectFarmer, type Farmer } from "@/lib/api"

// Map API status to display status
type DisplayStatus = "Pending" | "Verified" | "Rejected"
const mapStatus = (status: string): DisplayStatus => {
    switch (status) {
        case 'approved': return 'Verified'
        case 'rejected': return 'Rejected'
        default: return 'Pending'
    }
}

// Map display status to API status
const mapToApiStatus = (status: string): string => {
    switch (status) {
        case 'Verified': return 'approved'
        case 'Rejected': return 'rejected'
        case 'Pending': return 'pending'
        default: return ''
    }
}

// Business type display mapping
const businessTypeLabels: Record<string, string> = {
    'individual': 'Individual',
    'cv': 'CV',
    'pt': 'PT',
    'ud': 'UD',
    'cooperative': 'Koperasi'
}

export default function AdminDashboard() {
    const { t } = useI18n()
    const { ready, authenticated } = usePrivy()
    const [farmers, setFarmers] = useState<Farmer[]>([])
    const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Verified" | "Rejected">("All")
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Fetch farmers from API
    const fetchFarmers = async () => {
        setLoading(true)
        setError(null)
        try {
            const apiStatus = filterStatus === "All" ? undefined : mapToApiStatus(filterStatus)
            const data = await getFarmers(apiStatus)
            setFarmers(data)
        } catch (err) {
            console.error("Failed to fetch farmers:", err)
            setError("Failed to load farmers. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authenticated) {
            fetchFarmers()
        }
    }, [authenticated, filterStatus])

    const handleApprove = async (id: string) => {
        setActionLoading(id)
        try {
            await approveFarmer(id)
            // Update local state
            setFarmers((prev) =>
                prev.map((farmer) =>
                    farmer.id === id
                        ? { ...farmer, status: "approved" as const }
                        : farmer
                )
            )
        } catch (err) {
            console.error("Failed to approve farmer:", err)
            alert("Failed to approve farmer. Please try again.")
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (id: string) => {
        setActionLoading(id)
        try {
            await rejectFarmer(id)
            // Update local state
            setFarmers((prev) =>
                prev.map((farmer) =>
                    farmer.id === id
                        ? { ...farmer, status: "rejected" as const }
                        : farmer
                )
            )
        } catch (err) {
            console.error("Failed to reject farmer:", err)
            alert("Failed to reject farmer. Please try again.")
        } finally {
            setActionLoading(null)
        }
    }

    // Convert farmers to submission format for stats
    const submissions = farmers.map(farmer => ({
        id: farmer.id,
        farmerName: farmer.full_name,
        businessType: businessTypeLabels[farmer.business_type] || farmer.business_type,
        description: `${farmer.crops_expertise?.join(", ") || "N/A"}`,
        location: { district: farmer.district, city: farmer.city },
        email: farmer.email,
        phone: farmer.phone_number,
        landSize: "N/A",
        yearsOfExperience: farmer.years_of_experience,
        status: mapStatus(farmer.status),
        submittedAt: new Date(farmer.created_at),
        reviewedAt: farmer.reviewed_at ? new Date(farmer.reviewed_at) : undefined
    }))

    const filteredSubmissions = filterStatus === "All"
        ? submissions
        : submissions.filter((sub) => sub.status === filterStatus)

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
                                🎮 {t("admin.pageTitle")} 🎮
                            </h1>
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t("admin.pageDescription")}
                        </p>
                    </div>

                    {/* Statistics */}
                    <DashboardStats submissions={submissions} />

                    {/* Connect Wallet Button */}
                    <div className="flex justify-center my-8">
                        <ConnectWalletButton />
                    </div>

                    {/* Show content only if authenticated */}
                    {!ready ? (
                        <div className="pixel-border bg-card p-12 text-center rounded-lg">
                            <p className="font-pixel text-xs text-muted-foreground uppercase tracking-wide animate-pulse">⏳ Loading... ⏳</p>
                        </div>
                    ) : !authenticated ? (
                        <div className="pixel-border bg-card p-12 text-center rounded-lg">
                            <p className="font-pixel text-sm text-foreground uppercase tracking-wide mb-4">🔒 Authentication Required 🔒</p>
                            <p className="text-muted-foreground text-base mb-6">Please connect your wallet to access the admin dashboard</p>
                        </div>
                    ) : (
                        <>
                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <div className="flex items-center gap-2 text-foreground pixel-border bg-card px-4 py-2 rounded-lg">
                                    <Filter className="w-4 h-4" />
                                    <span className="font-pixel text-xs uppercase">{t("admin.filter")}:</span>
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
                                        {t(`admin.filters.${status.toLowerCase()}`)}
                                    </Button>
                                ))}
                                <Button
                                    onClick={fetchFarmers}
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                    className="pixel-button font-pixel text-xs uppercase tracking-wider rounded-md"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>

                            {/* Error State */}
                            {error && (
                                <div className="pixel-border bg-destructive/10 border-destructive p-4 text-center rounded-lg mb-8">
                                    <p className="text-destructive">{error}</p>
                                    <Button onClick={fetchFarmers} variant="outline" size="sm" className="mt-2">
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {/* Loading State */}
                            {loading ? (
                                <div className="pixel-border bg-card p-12 text-center rounded-lg">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                    <p className="font-pixel text-xs text-muted-foreground uppercase tracking-wide">Loading farmers...</p>
                                </div>
                            ) : filteredSubmissions.length > 0 ? (
                                <div className="pixel-border bg-card rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr className="border-b border-border">
                                                    <th className="text-left p-4 font-pixel text-xs uppercase text-foreground">Farmer</th>
                                                    <th className="text-left p-4 font-pixel text-xs uppercase text-foreground">{t("admin.submission.businessType")}</th>
                                                    <th className="text-left p-4 font-pixel text-xs uppercase text-foreground hidden md:table-cell">Location</th>
                                                    <th className="text-left p-4 font-pixel text-xs uppercase text-foreground hidden lg:table-cell">{t("admin.submission.experience")}</th>
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
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {submission.status === "Verified" && (
                                                                <span className="inline-block bg-primary text-primary-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg">
                                                                    ✓ {t("admin.status.verified")}
                                                                </span>
                                                            )}
                                                            {submission.status === "Rejected" && (
                                                                <span className="inline-block bg-destructive text-destructive-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg">
                                                                    ✗ {t("admin.status.rejected")}
                                                                </span>
                                                            )}
                                                            {submission.status === "Pending" && (
                                                                <span className="inline-block bg-secondary text-secondary-foreground pixel-border font-pixel text-[10px] px-3 py-1.5 rounded-lg animate-pulse-cta">
                                                                    ⏳ {t("admin.status.pending")}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            {submission.status === "Pending" ? (
                                                                <div className="flex gap-2 justify-center">
                                                                    <Button
                                                                        onClick={() => handleApprove(submission.id)}
                                                                        size="sm"
                                                                        disabled={actionLoading === submission.id}
                                                                        className="pixel-button bg-primary text-primary-foreground hover:bg-primary/90 font-pixel text-[10px] rounded-md px-3 py-1"
                                                                    >
                                                                        {actionLoading === submission.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "✓"}
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleReject(submission.id)}
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        disabled={actionLoading === submission.id}
                                                                        className="pixel-button font-pixel text-[10px] rounded-md px-3 py-1"
                                                                    >
                                                                        {actionLoading === submission.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "✗"}
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
                                    <p className="font-pixel text-xs text-muted-foreground uppercase tracking-wide mb-2">⚠️ {t("admin.emptyState.title")} ⚠️</p>
                                    <p className="text-muted-foreground text-sm">{t("admin.emptyState.description")}: {t(`admin.filters.${filterStatus.toLowerCase()}`)}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
