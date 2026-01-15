"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider, createConfig } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { mantleSepoliaTestnet } from "viem/chains"
import { http } from "wagmi"

// Configure wagmi with Mantle Sepolia
const wagmiConfig = createConfig({
    chains: [mantleSepoliaTestnet],
    transports: {
        [mantleSepoliaTestnet.id]: http(),
    },
})

// Create query client for react-query
const queryClient = new QueryClient()

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
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    )
}
