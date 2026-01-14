"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { mantleSepoliaTestnet } from "viem/chains"

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""

    if (!appId) {
        console.error("NEXT_PUBLIC_PRIVY_APP_ID is not set in environment variables")
    }

    return (
        <PrivyProvider
            appId={appId}
            config={{
                // Customize Privy's appearance
                appearance: {
                    theme: "dark",
                    accentColor: "#3d7a3d",
                    logo: "/ownafarm-logo.png",
                },
                // Login methods config
                loginMethods: [
                    "email",
                    "wallet",
                    "google",
                    "twitter",
                    "discord",
                    "github",
                    "linkedin",
                    "apple",
                ],
                // Embedded wallet configuration
                embeddedWallets: {
                    createOnLogin: "users-without-wallets",
                },
                // Supported chains
                supportedChains: [mantleSepoliaTestnet],
            }}
        >
            {children}
        </PrivyProvider>
    )
}
