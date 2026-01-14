"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"

export function ConnectWalletButton() {
    const { ready, authenticated, user, login, logout } = usePrivy()

    // Show loading state while Privy initializes
    if (!ready) {
        return (
            <button
                disabled
                className="pixel-button bg-primary/50 text-primary-foreground font-pixel text-lg px-8 py-4 rounded-lg uppercase tracking-wider shadow-lg cursor-not-allowed flex items-center gap-2"
            >
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
            </button>
        )
    }

    // If authenticated, show disconnect button with user info
    if (authenticated && user) {
        const displayAddress = user.wallet?.address
            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
            : user.email?.address || user.google?.email || user.twitter?.username || "Connected"

        return (
            <div className="flex flex-col items-center gap-3">
                <div className="pixel-border bg-card px-6 py-3 rounded-lg">
                    <p className="text-xs font-pixel text-muted-foreground uppercase mb-1">Connected as</p>
                    <p className="text-sm font-semibold text-foreground">{displayAddress}</p>
                </div>
                <button
                    onClick={logout}
                    className="pixel-button bg-destructive text-destructive-foreground font-pixel text-sm px-6 py-3 rounded-lg uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
                >
                    🔓 Disconnect
                </button>
            </div>
        )
    }

    // Show connect button if not authenticated
    return (
        <button
            onClick={login}
            className="pixel-button bg-primary text-primary-foreground font-pixel text-lg px-8 py-4 rounded-lg uppercase tracking-wider animate-pulse-cta hover:scale-105 transition-transform shadow-lg"
        >
            🔗 Connect Wallet
        </button>
    )
}
