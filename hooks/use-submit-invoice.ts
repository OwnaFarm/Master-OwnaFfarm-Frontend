'use client'

import { useCallback } from 'react'
import { useWriteContract, useWalletClient, useSwitchChain, useAccount } from 'wagmi'
import {
    OWNA_FARM_NFT_ADDRESS,
    OWNA_FARM_NFT_ABI,
    MANTLE_SEPOLIA_CHAIN_ID
} from '@/lib/contracts/owna-farm-nft'
import { parseEventLogs, createPublicClient, http } from 'viem'
import { mantleSepoliaTestnet } from 'viem/chains'

export interface SubmitInvoiceParams {
    offtakerId: `0x${string}`  // bytes32
    targetFund: bigint         // Amount in wei
    yieldBps: number           // Yield in basis points (e.g. 500 = 5%)
    duration: number           // Duration in seconds
}

export interface SubmitInvoiceResult {
    tokenId: bigint
    txHash: `0x${string}`
}

// Create a dedicated public client for Mantle Sepolia
const mantleSepoliaClient = createPublicClient({
    chain: mantleSepoliaTestnet,
    transport: http(),
})

export function useSubmitInvoice() {
    const { writeContractAsync, isPending, error } = useWriteContract()
    const { switchChainAsync } = useSwitchChain()
    const { chainId } = useAccount()

    const submitInvoice = useCallback(async (params: SubmitInvoiceParams): Promise<SubmitInvoiceResult> => {
        // Check if we need to switch chain
        if (chainId !== MANTLE_SEPOLIA_CHAIN_ID) {
            console.log(`Current chain: ${chainId}, switching to ${MANTLE_SEPOLIA_CHAIN_ID}...`)
            try {
                await switchChainAsync({ chainId: MANTLE_SEPOLIA_CHAIN_ID })
                // Wait a bit for the chain switch to propagate
                await new Promise(resolve => setTimeout(resolve, 1000))
            } catch (switchError: any) {
                console.error('Chain switch failed:', switchError)
                throw new Error(`Please switch to Mantle Sepolia network manually. ${switchError?.message || ''}`)
            }
        }

        // Submit transaction
        const txHash = await writeContractAsync({
            address: OWNA_FARM_NFT_ADDRESS,
            abi: OWNA_FARM_NFT_ABI,
            functionName: 'submitInvoice',
            args: [
                params.offtakerId,
                params.targetFund,
                params.yieldBps,
                params.duration
            ],
            chainId: MANTLE_SEPOLIA_CHAIN_ID,
        })

        // Wait for transaction receipt using dedicated Mantle Sepolia client
        const receipt = await mantleSepoliaClient.waitForTransactionReceipt({
            hash: txHash,
            confirmations: 1,
        })

        // Parse logs to get tokenId from InvoiceSubmitted event
        const logs = parseEventLogs({
            abi: OWNA_FARM_NFT_ABI,
            logs: receipt.logs,
            eventName: 'InvoiceSubmitted',
        })

        if (logs.length === 0) {
            throw new Error('InvoiceSubmitted event not found in transaction logs')
        }

        const tokenId = logs[0].args.tokenId

        return {
            tokenId,
            txHash,
        }
    }, [writeContractAsync, switchChainAsync, chainId])

    return {
        submitInvoice,
        isLoading: isPending,
        error,
        currentChainId: chainId,
    }
}

// Helper: Generate bytes32 offtakerId from farmer data
export function generateOfftakerId(email: string, timestamp: number): `0x${string}` {
    // Create a unique identifier from email + timestamp
    const data = `${email}-${timestamp}`
    const encoder = new TextEncoder()
    const bytes = encoder.encode(data)

    // Convert to hex and pad to 64 chars (32 bytes)
    let hex = ''
    for (const b of bytes) {
        hex += b.toString(16).padStart(2, '0')
    }

    return `0x${hex.padEnd(64, '0').slice(0, 64)}` as `0x${string}`
}
