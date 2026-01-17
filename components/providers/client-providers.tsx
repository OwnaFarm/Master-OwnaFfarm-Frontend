"use client"

import dynamic from "next/dynamic"

// Dynamically import PrivyProviderWrapper to avoid SSR issues with wallet libraries
const PrivyProviderWrapper = dynamic(
  () => import("@/components/providers/privy-provider").then(mod => mod.PrivyProviderWrapper),
  { ssr: false }
)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
}
